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

    const { error } = await supabase
        .from('lottery_assignments')
        .upsert({
            draw_id: drawId,
            festero_id: festeroId,
            quantity,
            status: 'pending'
        }, { onConflict: 'draw_id,festero_id' })

    if (error) {
        console.error('Error updating assignment:', error)
        throw new Error('Error al actualizar asignación')
    }

    revalidatePath(`/admin/loteria/${drawId}`)
}

export async function bulkAssign(drawId: string, quantity: number) {
    const supabase = await createClient()

    // 1. Obtener todos los festeros ids
    const { data: festeros } = await supabase.from('festeros').select('id')
    if (!festeros) throw new Error('No se encontraron festeros')

    // 2. Preparar datos para upsert masivo
    const upserts = festeros.map(f => ({
        draw_id: drawId,
        festero_id: f.id,
        quantity: quantity,
        status: 'pending'
    }))

    // 3. Ejecutar upsert (Supabase maneja el conflicto con draw_id,festero_id)
    const { error } = await supabase
        .from('lottery_assignments')
        .upsert(upserts, { onConflict: 'draw_id,festero_id' })

    if (error) {
        console.error('Error in bulk assignment:', error)
        throw new Error('Error en la asignación masiva')
    }

    revalidatePath(`/admin/loteria/${drawId}`)
}
