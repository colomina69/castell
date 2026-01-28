"use server"

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return redirect('/login?error=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/perfil')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // 1. Verificar si es socio (usando Service Role para saltar RLS)
    const adminClient = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    )

    const { count } = await adminClient
        .from('festeros')
        .select('*', { count: 'exact', head: true })
        .ilike('email', email)

    if (count === 0) {
        return redirect('/signup?error=' + encodeURIComponent('El correo no pertenece a ningún socio de la Filà.'))
    }

    const data = {
        email,
        password,
    }

    const { data: authData, error } = await supabase.auth.signUp(data)

    if (error) {
        return redirect('/signup?error=' + encodeURIComponent(error.message))
    }

    // 2. Vincular usuario con festero
    if (authData.user) {
        await adminClient
            .from('festeros')
            .update({ user_id: authData.user.id })
            .ilike('email', email)
    }

    revalidatePath('/', 'layout')
    redirect('/login?message=Revisa tu correo para confirmar tu cuenta y acceder.')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
