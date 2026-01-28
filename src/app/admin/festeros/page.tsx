"use client"

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FesteroForm } from '@/components/admin/FesteroForm'
import { FesteroTable } from '@/components/admin/FesteroTable'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Users, RefreshCw, AlertCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import {
    getFesteros,
    getProfiles,
    createFestero,
    updateFestero,
    deleteFestero,
    updateUserRole
} from './actions'
import type { Festero, Profile } from '@/types'

export default function AdminFesterosPage() {
    const router = useRouter()
    const supabase = createClient()

    const [festeros, setFesteros] = useState<Festero[]>([])
    const [profiles, setProfiles] = useState<Profile[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [editingFestero, setEditingFestero] = useState<Festero | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    const loadData = useCallback(async () => {
        setLoading(true)
        setError(null)

        const [festerosResult, profilesResult] = await Promise.all([
            getFesteros(),
            getProfiles()
        ])

        if (festerosResult.error) {
            setError(festerosResult.error)
            setLoading(false)
            return
        }

        if (profilesResult.error) {
            setError(profilesResult.error)
            setLoading(false)
            return
        }

        setFesteros(festerosResult.festeros)
        setProfiles(profilesResult.profiles)
        setIsAdmin(true)
        setLoading(false)
    }, [])

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            loadData()
        }
        checkAuth()
    }, [supabase.auth, router, loadData])

    const handleCreate = async (formData: FormData) => {
        const result = await createFestero(formData)
        if (result.success) {
            await loadData()
        }
        return result
    }

    const handleUpdate = async (formData: FormData) => {
        if (!editingFestero) return { success: false, error: 'No hay festero seleccionado' }
        const result = await updateFestero(editingFestero.id, formData)
        if (result.success) {
            await loadData()
        }
        return result
    }

    const handleDelete = async (id: string) => {
        const result = await deleteFestero(id)
        if (result.success) {
            await loadData()
        }
    }

    const handleToggleRole = async (userId: string, currentRole: 'admin' | 'member') => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin'
        const result = await updateUserRole(userId, newRole)
        if (result.success) {
            await loadData()
        }
    }

    const openCreateForm = () => {
        setEditingFestero(null)
        setShowForm(true)
    }

    const openEditForm = (festero: Festero) => {
        setEditingFestero(festero)
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
        setEditingFestero(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error && !isAdmin) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center pt-20">
                    <div className="text-center p-8">
                        <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-foreground mb-2">Acceso Denegado</h1>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                        >
                            Volver al Inicio
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                                    <div className="p-3 bg-primary/10 rounded-xl">
                                        <Users className="w-8 h-8 text-primary" />
                                    </div>
                                    Gestión de Festeros
                                </h1>
                                <p className="text-muted-foreground mt-2">
                                    Administra los socios de la filà ({festeros.length} festeros)
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={loadData}
                                    className="p-3 bg-muted hover:bg-muted/80 rounded-xl transition-colors"
                                    title="Refrescar"
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={openCreateForm}
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-md"
                                >
                                    <Plus className="w-5 h-5" />
                                    Nuevo Festero
                                </motion.button>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-center gap-3 text-destructive">
                                <AlertCircle className="w-5 h-5" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Table */}
                        <FesteroTable
                            festeros={festeros}
                            profiles={profiles}
                            onEdit={openEditForm}
                            onDelete={handleDelete}
                            onToggleRole={handleToggleRole}
                        />

                    </div>
                </div>
            </main>

            <Footer />

            {/* Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <FesteroForm
                        festero={editingFestero}
                        onSubmit={editingFestero ? handleUpdate : handleCreate}
                        onClose={closeForm}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
