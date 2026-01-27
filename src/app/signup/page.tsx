"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { signup } from '../auth/actions'
import { Shield, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

function SignupForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    return (
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />

            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            <form action={signup} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="ejemplo@correo.com"
                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1">Contraseña</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                        />
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-1 italic">
                        * Tu cuenta requerirá aprobación por parte de la directiva.
                    </p>
                </div>

                <button
                    type="submit"
                    className="w-full bg-accent text-white font-bold py-4 rounded-xl hover:bg-accent/90 transition-all shadow-md active:scale-[0.98]"
                >
                    Registrar Cuenta
                </button>
            </form>

            <p className="text-center mt-8 text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-primary font-bold hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
    )
}

export default function SignupPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <div className="bg-accent/10 p-4 rounded-full border border-accent/20">
                            <UserPlus className="w-12 h-12 text-accent" />
                        </div>
                    </Link>
                    <h1 className="font-display text-4xl font-bold text-primary">Unirse a la Filà</h1>
                    <p className="text-muted-foreground mt-2">Crea tu cuenta de socio para acceder</p>
                </div>

                <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando formulario...</div>}>
                    <SignupForm />
                </Suspense>
            </motion.div>
        </div>
    )
}
