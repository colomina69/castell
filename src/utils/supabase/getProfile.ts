import { createClient } from './client'
import type { Profile } from '@/types'

export async function getProfile(): Promise<Profile | null> {
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return profile as Profile | null
}

export async function isAdmin(): Promise<boolean> {
    const profile = await getProfile()
    return profile?.role === 'admin'
}
