"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { motion } from 'framer-motion'
import { User, Mail, Shield, LogOut, Settings, Bell, CreditCard, Ticket } from 'lucide-react'
import { logout } from '../auth/actions'
import { getMyLotteryAssignments } from './actions'

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [assignments, setAssignments] = useState<any[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const loadData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }
            setUser(user)

            try {
                const lotteryData = await getMyLotteryAssignments()
                setAssignments(Array.isArray(lotteryData) ? lotteryData : [])
            } catch (err) {
                console.error('Error loading lottery data:', err)
            }

            setLoading(false)
        }
        loadData()
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            {[
                                { label: 'Décimos Asignados', value: assignments.reduce((acc, curr) => acc + (curr.quantity || 0), 0), icon: Bell, color: 'text-blue-500' },
                                {
                                    label: 'Pendiente Lotería', value: `${assignments.reduce((acc, curr) => {
                                        const total = (curr.quantity || 0) * (Number(curr.lottery_draws?.ticket_price || 0) + Number(curr.lottery_draws?.surcharge || 0));
                                        return acc + (total - Number(curr.amount_paid || 0));
                                    }, 0).toFixed(2)}€`, icon: CreditCard, color: 'text-amber-500'
                                },
                                { label: 'Estado General', value: 'Al día', icon: Shield, color: 'text-primary' },
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

                        {/* Lotería Asignada */}
                        <div className="mb-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Ticket className="w-6 h-6 text-amber-600" /> Mi Lotería Asignada
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {assignments.length > 0 ? (
                                    assignments.map((assignment, i) => {
                                        const draw = assignment.lottery_draws;
                                        if (!draw) return null;

                                        const pricePerTicket = Number(draw.ticket_price || 0) + Number(draw.surcharge || 0);
                                        const totalPrice = (assignment.quantity || 0) * pricePerTicket;
                                        const pending = totalPrice - Number(assignment.amount_paid || 0);

                                        return (
                                            <motion.div
                                                key={assignment.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm hover:border-amber-500/30 transition-all group"
                                            >
                                                <div className="p-6">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="font-bold text-lg group-hover:text-amber-700 transition-colors">{draw.name}</h3>
                                                            <p className="text-sm text-muted-foreground">Sorteo: {new Date(draw.draw_date).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${pending === 0 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {pending === 0 ? 'Liquidado' : 'Pendiente'}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-end justify-between gap-4">
                                                        <div className="space-y-1">
                                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Asignación</p>
                                                            <p className="text-2xl font-black text-foreground">{assignment.quantity} <span className="text-sm font-normal text-muted-foreground">décimos</span></p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total a pagar</p>
                                                            <p className="text-xl font-bold text-amber-700">{totalPrice.toFixed(2)}€</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-muted/30 px-6 py-3 border-t border-border/50 flex justify-between items-center text-sm">
                                                    <span className="text-muted-foreground">Pagado: {Number(assignment.amount_paid).toFixed(2)}€</span>
                                                    {pending > 0 && (
                                                        <span className="font-bold text-destructive">Debe: {pending.toFixed(2)}€</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="md:col-span-2 p-12 text-center bg-muted/20 border-2 border-dashed border-muted-foreground/20 rounded-2xl">
                                        <Ticket className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
                                        <p className="text-muted-foreground">No tienes lotería asignada en este momento.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm h-full">
                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Settings className="w-6 h-6 text-primary" /> Información de Miembro
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Email de Cuenta</p>
                                            <p className="font-medium text-foreground">{user?.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">ID de Socio</p>
                                            <p className="font-mono text-xs text-muted-foreground">{user?.id}</p>
                                        </div>
                                        <div className="p-4 bg-muted/30 rounded-xl sm:col-span-2">
                                            <p className="text-xs text-muted-foreground mb-2">Para modificar tus datos personales o de contacto, por favor contacta con el secretario de la Filà.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 shadow-sm">
                                    <h3 className="text-xl font-bold mb-4 text-primary">Próximos Actos</h3>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg text-sm border border-black/5">
                                            <p className="font-bold mb-1">Mig Any 2026</p>
                                            <p className="text-muted-foreground">Próximo sábado 15 de febrero.</p>
                                        </div>
                                        <div className="p-3 bg-white/50 dark:bg-black/20 rounded-lg text-sm border border-black/5">
                                            <p className="font-bold mb-1">Asamblea General</p>
                                            <p className="text-muted-foreground">Viernes 21 de marzo a las 20:00h.</p>
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
