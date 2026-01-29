'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Database } from '@/types/supabase'

export type LotteryDraw = Database['public']['Tables']['lottery_draws']['Row']
export type LotteryAssignment = Database['public']['Tables']['lottery_assignments']['Row']

// ... (funciones anteriores getLotteryDraws, getLotteryDraw, createLotteryDraw, deleteLotteryDraw se mantienen, solo agrego nuevas) ...
// Para mantener el archivo limpio, reescribo todo con las nuevas funciones añadidas

export async function getLotteryDraws() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .order('draw_date', { ascending: false })

    if (error) {
        console.error('Error fetching lottery draws:', error)
        throw new Error('Error al obtener los sorteos')
    }

    return data
}

export async function getLotteryDraw(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('lottery_draws')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching lottery draw:', error)
        // No throw here to allow page handle 404 gracefully if needed, or throw if preferred.
        return null
    }

    return data
}

export async function createLotteryDraw(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const draw_date = formData.get('draw_date') as string
    const ticket_price = parseFloat(formData.get('ticket_price') as string)
    const surcharge = parseFloat(formData.get('surcharge') as string || '0')
    const status = formData.get('status') as Database['public']['Enums']['lottery_status'] || 'draft'

    const { error } = await supabase.from('lottery_draws').insert({
        name,
        draw_date,
        ticket_price,
        surcharge,
        status
    })

    if (error) {
        console.error('Error creating lottery draw:', error)
        throw new Error('Error al crear el sorteo')
    }

    revalidatePath('/admin/loteria')
    redirect('/admin/loteria')
}

export async function updateLotteryDraw(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const draw_date = formData.get('draw_date') as string
    const ticket_price = parseFloat(formData.get('ticket_price') as string)
    const surcharge = parseFloat(formData.get('surcharge') as string || '0')
    const status = formData.get('status') as Database['public']['Enums']['lottery_status']

    const { error } = await supabase
        .from('lottery_draws')
        .update({
            name,
            draw_date,
            ticket_price,
            surcharge,
            status
        })
        .eq('id', id)

    if (error) {
        console.error('Error updating lottery draw:', error)
        throw new Error('Error al actualizar el sorteo')
    }

    revalidatePath('/admin/loteria')
    revalidatePath(`/admin/loteria/${id}`)
    redirect('/admin/loteria') // Optional: stay on page or go back
}

export async function deleteLotteryDraw(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('lottery_draws').delete().eq('id', id)

    if (error) {
        console.error('Error deleting lottery draw:', error)
        throw new Error('Error al eliminar el sorteo')
    }

    revalidatePath('/admin/loteria')
    redirect('/admin/loteria')
}

// Nueva función para obtener asignaciones combinadas
export async function getDrawAssignments(drawId: string) {
    const supabase = await createClient()

    // 1. Obtener todos los festeros
    const { data: festeros, error: festerosError } = await supabase
        .from('festeros')
        .select('id, nombre, primer_apellido, segundo_apellido')
        .order('primer_apellido')
        .order('nombre')

    if (festerosError) throw new Error('Error al obtener festeros')

    // 2. Obtener asignaciones existentes para este sorteo
    const { data: assignments, error: assignmentsError } = await supabase
        .from('lottery_assignments')
        .select('*')
        .eq('draw_id', drawId)

    if (assignmentsError) throw new Error('Error al obtener asignaciones')

    // 3. Combinar datos
    const combinedData = festeros.map(festero => {
        const assignment = assignments?.find(a => a.festero_id === festero.id)
        return {
            festero_id: festero.id,
            festero_name: `${festero.primer_apellido || ''} ${festero.segundo_apellido || ''}, ${festero.nombre || ''}`.trim(),
            assignment_id: assignment?.id || null,
            quantity: assignment?.quantity || 0,
            amount_paid: assignment?.amount_paid || 0,
            status: assignment?.status || 'pending'
        }
    })

    return combinedData
}

export async function updateAssignment(drawId: string, festeroId: string, quantity: number) {
    const supabase = await createClient()

    // Check if assignment exists using unique key logic (draw_id + festero_id)
    // First try to find existing assignment to get ID, or upsert.
    // Upsert needs a unique constraint on (draw_id, festero_id). I didn't create that index explicitly as unique but it logic allows it.
    // I'll assume standard upsert if I had a constraint, but without it I should check first.
    // Actually, I can use select.

    const { data: existing } = await supabase
        .from('lottery_assignments')
        .select('id')
        .eq('draw_id', drawId)
        .eq('festero_id', festeroId)
        .single()

    let error;

    if (existing) {
        const { error: updError } = await supabase
            .from('lottery_assignments')
            .update({ quantity })
            .eq('id', existing.id)
        error = updError;
    } else {
        const { error: insError } = await supabase
            .from('lottery_assignments')
            .insert({
                draw_id: drawId,
                festero_id: festeroId,
                quantity,
                status: 'pending'
            })
        error = insError;
    }

    if (error) {
        console.error('Error updating assignment:', error)
        throw new Error('Error al actualizar asignación')
    }

    revalidatePath(`/admin/loteria/${drawId}`)
}

export async function bulkAssign(drawId: string, quantity: number) {
    const supabase = await createClient()

    // Obtener todos los festeros ids
    const { data: festeros } = await supabase.from('festeros').select('id')
    if (!festeros) throw new Error('No se encontraron festeros')

    // Prepare upserts. Need to identify existing ones to update or insert new ones.
    // A loop is easier for logic if quantity is handled individually, but for bulk 'set to X' we want to override or set if zero?
    // User probably wants "Set everyone to X tickets".

    // For efficiency, I might delete all and recreate? No, that loses payment data created_at etc.
    // I will iterate and update/insert. (For 100-200 members it's fine).

    // Optimization: Get all assignments first.
    const { data: existingAssignments } = await supabase
        .from('lottery_assignments')
        .select('id, festero_id')
        .eq('draw_id', drawId)

    const existingMap = new Map(existingAssignments?.map(a => [a.festero_id, a.id]))

    const updates = []
    const inserts = []

    for (const f of festeros) {
        if (existingMap.has(f.id)) {
            updates.push(f.id) // We'll update these
        } else {
            inserts.push({
                draw_id: drawId,
                festero_id: f.id,
                quantity: quantity
            })
        }
    }

    // Execute inserts
    if (inserts.length > 0) {
        const { error } = await supabase.from('lottery_assignments').insert(inserts)
        if (error) throw error
    }

    // Execute updates (can't do bulk update with different WHERE clauses easily without complex query, but here we update ALL to same quantity)
    // So we can update where draw_id = X AND festero_id IN list
    if (updates.length > 0) {
        const { error } = await supabase
            .from('lottery_assignments')
            .update({ quantity: quantity })
            .eq('draw_id', drawId)
            .in('festero_id', updates)
        if (error) throw error
    }

    revalidatePath(`/admin/loteria/${drawId}`)
}
