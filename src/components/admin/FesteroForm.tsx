"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Save, User, Mail, Phone, Calendar } from 'lucide-react'
import type { Festero } from '@/types'

interface FesteroFormProps {
    festero?: Festero | null
    onSubmit: (formData: FormData) => Promise<{ success: boolean, error: string | null }>
    onClose: () => void
}

export function FesteroForm({ festero, onSubmit, onClose }: FesteroFormProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await onSubmit(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            onClose()
        }
    }

    const inputClass = "w-full bg-muted/30 border border-border/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card border border-border/50 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                        {festero ? 'Editar Festero' : 'Nuevo Festero'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Nombre *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    name="nombre"
                                    type="text"
                                    required
                                    defaultValue={festero?.nombre || ''}
                                    placeholder="Nombre"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Primer Apellido */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Primer Apellido *</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    name="primer_apellido"
                                    type="text"
                                    required
                                    defaultValue={festero?.primer_apellido || ''}
                                    placeholder="Primer apellido"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Segundo Apellido */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Segundo Apellido</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    name="segundo_apellido"
                                    type="text"
                                    defaultValue={festero?.segundo_apellido || ''}
                                    placeholder="Segundo apellido"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={festero?.email || ''}
                                    placeholder="correo@ejemplo.com"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    name="telefono"
                                    type="tel"
                                    defaultValue={festero?.telefono || ''}
                                    placeholder="+34 600 000 000"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Fecha de Nacimiento */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1">Fecha de Nacimiento</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    name="fecha_nacimiento"
                                    type="date"
                                    defaultValue={festero?.fecha_nacimiento || ''}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 bg-muted hover:bg-muted/80 rounded-xl font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-6 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}
