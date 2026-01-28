"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2, Trash2, Shield, ShieldOff, User, Mail, Phone, Users } from 'lucide-react'
import type { Festero, Profile } from '@/types'

interface FesteroTableProps {
    festeros: Festero[]
    profiles: Profile[]
    onEdit: (festero: Festero) => void
    onDelete: (id: string) => Promise<void>
    onToggleRole: (userId: string, currentRole: 'admin' | 'member') => Promise<void>
}

export function FesteroTable({ festeros, profiles, onEdit, onDelete, onToggleRole }: FesteroTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [togglingRoleId, setTogglingRoleId] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este festero?')) return
        setDeletingId(id)
        await onDelete(id)
        setDeletingId(null)
    }

    const handleToggleRole = async (userId: string, currentRole: 'admin' | 'member') => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin'
        if (!confirm(`¿Cambiar rol a ${newRole === 'admin' ? 'Administrador' : 'Miembro'}?`)) return
        setTogglingRoleId(userId)
        await onToggleRole(userId, currentRole)
        setTogglingRoleId(null)
    }

    // Crear mapa de perfiles por ID para buscar rol usando user_id del festero
    const profileById = new Map<string, Profile>()
    profiles.forEach(p => {
        profileById.set(p.id, p)
    })

    // Función helper para obtener nombre completo
    const getNombreCompleto = (festero: Festero) => {
        const partes = [festero.nombre, festero.primer_apellido, festero.segundo_apellido].filter(Boolean)
        return partes.join(' ')
    }

    return (
        <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-muted/30 border-b border-border/50">
                            <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Nombre</th>
                            <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Email</th>
                            <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Teléfono</th>
                            <th className="text-center py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Rol</th>
                            <th className="text-right py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {festeros.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No hay festeros registrados</p>
                                </td>
                            </tr>
                        ) : (
                            festeros.map((festero, index) => {
                                // Buscar perfil usando user_id del festero
                                const profile = festero.user_id ? profileById.get(festero.user_id) : null
                                const isAdmin = profile?.role === 'admin'
                                const hasAccount = !!profile

                                return (
                                    <motion.tr
                                        key={festero.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                                    >
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-foreground">{getNombreCompleto(festero)}</p>
                                                    <p className="text-xs text-muted-foreground md:hidden">{festero.email || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Mail className="w-4 h-4" />
                                                {festero.email || '-'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden lg:table-cell">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Phone className="w-4 h-4" />
                                                {festero.telefono || '-'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            {hasAccount ? (
                                                <button
                                                    onClick={() => handleToggleRole(profile.id, profile.role)}
                                                    disabled={togglingRoleId === profile.id}
                                                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${isAdmin
                                                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'
                                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                                                        } ${togglingRoleId === profile.id ? 'opacity-50' : ''}`}
                                                >
                                                    {isAdmin ? <Shield className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                                                    {isAdmin ? 'Admin' : 'Miembro'}
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                    Sin cuenta
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(festero)}
                                                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(festero.id)}
                                                    disabled={deletingId === festero.id}
                                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors disabled:opacity-50"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
