"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { login } from '../auth/actions'
import { Shield, Mail, Lock, AlertCircle } from 'lucide-react'
import { Suspense } from 'react'

function LoginForm() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const message = searchParams.get('message')

    return (
        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-xl">
            {error && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {message && (
                <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-start gap-3 text-primary text-sm">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{message}</p>
                </div>
            )}

            <form action={login} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground ml-1">Correo Electrónico</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="ejemplo@correo.com"
                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-medium text-foreground">Contraseña</label>
                        <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary/90 transition-all shadow-md active:scale-[0.98]"
                >
                    Iniciar Sesión
                </button>
            </form>

            <p className="text-center mt-8 text-sm text-muted-foreground">
                ¿Aún no tienes cuenta?{' '}
                <Link href="/signup" className="text-primary font-bold hover:underline">
                    Regístrate aquí
                </Link>
            </p>
        </div>
    )
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
                            <Shield className="w-12 h-12 text-primary" />
                        </div>
                    </Link>
                    <h1 className="font-display text-3xl font-bold text-primary">Acceso Socios</h1>
                    <p className="text-muted-foreground mt-2">Bienvenido de nuevo a la Filà</p>
                </div>

                <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando formulario...</div>}>
                    <LoginForm />
                </Suspense>

                <div className="text-center mt-8">
                    <Link href="/" className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center justify-center gap-2">
                        Volver al inicio
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
