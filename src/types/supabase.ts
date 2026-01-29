export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            festeros: {
                Row: {
                    created_at: string | null
                    email: string | null
                    fecha_nacimiento: string | null
                    id: string
                    nombre: string | null
                    primer_apellido: string | null
                    segundo_apellido: string | null
                    telefono: string | null
                    user_id: string | null
                }
                Insert: {
                    created_at?: string | null
                    email?: string | null
                    fecha_nacimiento?: string | null
                    id?: string
                    nombre?: string | null
                    primer_apellido?: string | null
                    segundo_apellido?: string | null
                    telefono?: string | null
                    user_id?: string | null
                }
                Update: {
                    created_at?: string | null
                    email?: string | null
                    fecha_nacimiento?: string | null
                    id?: string
                    nombre?: string | null
                    primer_apellido?: string | null
                    segundo_apellido?: string | null
                    telefono?: string | null
                    user_id?: string | null
                }
                Relationships: []
            }
            lottery_draws: {
                Row: {
                    id: string
                    name: string
                    draw_date: string
                    ticket_price: number
                    surcharge: number | null
                    status: Database["public"]["Enums"]["lottery_status"] | null
                    created_at: string | null
                }
                Insert: {
                    id?: string
                    name: string
                    draw_date: string
                    ticket_price: number
                    surcharge?: number | null
                    status?: Database["public"]["Enums"]["lottery_status"] | null
                    created_at?: string | null
                }
                Update: {
                    id?: string
                    name?: string
                    draw_date?: string
                    ticket_price?: number
                    surcharge?: number | null
                    status?: Database["public"]["Enums"]["lottery_status"] | null
                    created_at?: string | null
                }
                Relationships: []
            }
            lottery_assignments: {
                Row: {
                    id: string
                    draw_id: string
                    festero_id: string
                    quantity: number | null
                    status: string | null
                    amount_paid: number | null
                    created_at: string | null
                    updated_at: string | null
                }
                Insert: {
                    id?: string
                    draw_id: string
                    festero_id: string
                    quantity?: number | null
                    status?: string | null
                    amount_paid?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Update: {
                    id?: string
                    draw_id?: string
                    festero_id?: string
                    quantity?: number | null
                    status?: string | null
                    amount_paid?: number | null
                    created_at?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "lottery_assignments_draw_id_fkey"
                        columns: ["draw_id"]
                        referencedRelation: "lottery_draws"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "lottery_assignments_festero_id_fkey"
                        columns: ["festero_id"]
                        referencedRelation: "festeros"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string
                    full_name: string | null
                    id: string
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string
                    full_name?: string | null
                    id: string
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string
                    full_name?: string | null
                    id?: string
                    role?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            lottery_status: "active" | "closed" | "draft"
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
