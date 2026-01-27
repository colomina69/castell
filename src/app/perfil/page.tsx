"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { User, Mail, Shield, LogOut, Settings, Bell, CreditCard } from 'lucide-react'
import { logout } from '../auth/actions'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                redirect('/login')
            }
            setUser(user)
            setLoading(false)
        }
        getUser()
    }, [supabase.auth])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow pt-28 pb-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">

                        {/* Header Profile */}
                        <div className="bg-card border border-border/50 rounded-3xl p-8 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                            <div className="relative">
                                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                    <User className="w-12 h-12" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-card" />
                            </div>

                            <div className="text-center md:text-left flex-grow">
                                <h1 className="text-3xl font-bold text-foreground mb-1">Panel del Socio</h1>
                                <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-4 h-4" /> {user?.email}
                                </p>
                                <div className="inline-flex items-center gap-2 mt-4 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                    <Shield className="w-3 h-3" /> Socio Activo
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => logout()}
                                    className="flex items-center gap-2 px-6 py-3 bg-muted hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all font-medium border border-border/50"
                                >
                                    <LogOut className="w-5 h-5" /> Salir
                                </button>
                            </div>
                        </div>

                        {/* Grid Stats/Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {[
                                { label: 'Antigüedad', value: '5 años', icon: Bell, color: 'text-blue-500' },
                                { label: 'Estado Cuota', value: 'Al día', icon: CreditCard, color: 'text-green-500' },
                                { label: 'Próximo Evento', value: 'Mig Any', icon: Shield, color: 'text-primary' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm"
                                >
                                    <div className={`${stat.color} bg-current/10 w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* Content Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Settings className="w-6 h-6 text-primary" /> Información de Contacto
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Nombre Completo</p>
                                            <p className="font-medium text-foreground">Juan Pérez García</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">DNI</p>
                                            <p className="font-medium text-foreground">12345678X</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Teléfono</p>
                                            <p className="font-medium text-foreground">+34 600 000 000</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Escuadra</p>
                                            <p className="font-medium text-foreground">Escuadra de Honor</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold mb-4 text-primary">Avisos de la Filà</h3>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg text-sm border border-black/5">
                                            <p className="font-bold mb-1">Lotería de Navidad</p>
                                            <p className="text-muted-foreground">Ya puedes pasar a recoger tus papeletas de lotería en la sede.</p>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg text-sm border border-black/5">
                                            <p className="font-bold mb-1">Cena de Hermandad</p>
                                            <p className="text-muted-foreground">Confirmar asistencia antes del viernes 4.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
