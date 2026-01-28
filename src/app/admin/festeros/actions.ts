"use server"

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import type { Festero, Profile } from '@/types'

// Helper para verificar si el usuario actual es admin
async function verifyAdmin(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}

// Obtener todos los festeros
export async function getFesteros(): Promise<{ festeros: Festero[], error: string | null }> {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
        return { festeros: [], error: 'No tienes permisos de administrador' }
    }

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await adminClient
        .from('festeros')
        .select('*')
        .order('primer_apellido', { ascending: true })

    if (error) {
        return { festeros: [], error: error.message }
    }

    return { festeros: data as Festero[], error: null }
}

// Obtener todos los perfiles con sus roles
export async function getProfiles(): Promise<{ profiles: Profile[], error: string | null }> {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
        return { profiles: [], error: 'No tienes permisos de administrador' }
    }

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await adminClient
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true })

    if (error) {
        return { profiles: [], error: error.message }
    }

    return { profiles: data as Profile[], error: null }
}

// Crear nuevo festero
export async function createFestero(formData: FormData): Promise<{ success: boolean, error: string | null }> {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
        return { success: false, error: 'No tienes permisos de administrador' }
    }

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const festero = {
        nombre: formData.get('nombre') as string,
        primer_apellido: formData.get('primer_apellido') as string,
        segundo_apellido: formData.get('segundo_apellido') as string || null,
        email: formData.get('email') as string || null,
        telefono: formData.get('telefono') as string || null,
        fecha_nacimiento: formData.get('fecha_nacimiento') as string || null,
    }

    const { error } = await adminClient
        .from('festeros')
        .insert(festero)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/festeros')
    return { success: true, error: null }
}

// Actualizar festero
export async function updateFestero(id: string, formData: FormData): Promise<{ success: boolean, error: string | null }> {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
        return { success: false, error: 'No tienes permisos de administrador' }
    }

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const festero = {
        nombre: formData.get('nombre') as string,
        primer_apellido: formData.get('primer_apellido') as string,
        segundo_apellido: formData.get('segundo_apellido') as string || null,
        email: formData.get('email') as string || null,
        telefono: formData.get('telefono') as string || null,
        fecha_nacimiento: formData.get('fecha_nacimiento') as string || null,
    }

    const { error } = await adminClient
        .from('festeros')
        .update(festero)
        .eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/festeros')
    return { success: true, error: null }
}

// Eliminar festero
export async function deleteFestero(id: string): Promise<{ success: boolean, error: string | null }> {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
        return { success: false, error: 'No tienes permisos de administrador' }
    }

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await adminClient
        .from('festeros')
        .delete()
        .eq('id', id)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/festeros')
    return { success: true, error: null }
}

// Cambiar rol de usuario
export async function updateUserRole(userId: string, newRole: 'admin' | 'member'): Promise<{ success: boolean, error: string | null }> {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) {
        return { success: false, error: 'No tienes permisos de administrador' }
    }

    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await adminClient
        .from('profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)

    if (error) {
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/festeros')
    return { success: true, error: null }
}
