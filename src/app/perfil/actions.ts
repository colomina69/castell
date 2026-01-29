'use server'

import { createClient } from '@/utils/supabase/server'

export async function getMyLotteryAssignments() {
    const supabase = await createClient()

    // 1. Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autenticado')

    // 2. Obtener el ID del festero asociado a este usuario
    const { data: festero, error: festeroError } = await supabase
        .from('festeros')
        .select('id')
        .eq('user_id', user.id)
        .single()

    if (festeroError || !festero) {
        console.error('Error fetching festero for user:', festeroError)
        return []
    }

    // 3. Obtener las asignaciones de lotería con detalles del sorteo
    const { data: assignments, error: assignmentsError } = await supabase
        .from('lottery_assignments')
        .select(`
            id,
            quantity,
            amount_paid,
            status,
            draw_id,
            lottery_draws (
                id,
                name,
                draw_date,
                ticket_price,
                surcharge
            )
        `)
        .eq('festero_id', festero.id)
        .order('created_at', { ascending: false })

    if (assignmentsError) {
        console.error('Error fetching assignments:', assignmentsError)
        throw new Error('Error al obtener asignaciones')
    }

    return assignments as any[]
}
