export interface Profile {
    id: string
    full_name: string | null
    role: 'admin' | 'member'
    avatar_url: string | null
    created_at: string
    updated_at: string
}

export interface Festero {
    id: string
    user_id: string | null
    nombre: string
    primer_apellido: string
    segundo_apellido: string | null
    email: string | null
    telefono: string | null
    fecha_nacimiento: string | null
    created_at: string
}
