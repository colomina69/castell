"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, Settings } from 'lucide-react'
import { cn } from '@/utils/cn'
import { createClient } from '@/utils/supabase/client'

const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Historia', href: '/historia' },
    { name: 'Galería', href: '/galeria' },
    { name: 'Actos', href: '/actos' },
    { name: 'Contacto', href: '/contacto' },
]

export function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                // Obtener el perfil para verificar si es admin
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single()

                setIsAdmin(profile?.role === 'admin')
            }
        }
        checkUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setUser(session?.user ?? null)

            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single()

                setIsAdmin(profile?.role === 'admin')
            } else {
                setIsAdmin(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth, supabase])

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative">
                        <Image
                            src="/escudo.png"
                            alt="Escudo Fila Moros del Castell"
                            width={48}
                            height={48}
                            priority
                            unoptimized={true}
                            className="object-contain drop-shadow-md"
                            style={{
                                imageRendering: '-webkit-optimize-contrast',
                                transform: 'translateZ(0)' // Force GPU acceleration
                            }}
                        />
                    </div>
                    <span className="hidden sm:block font-display text-xl font-bold text-primary">
                        Moros del Castell
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            {isAdmin && (
                                <Link
                                    href="/admin/festeros"
                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full text-sm font-bold hover:bg-amber-500/20 transition-all"
                                >
                                    <Settings className="w-4 h-4" />
                                    Gestión
                                </Link>
                            )}
                            <Link
                                href="/perfil"
                                className="flex items-center gap-2 px-6 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-bold hover:bg-primary/20 transition-all"
                            >
                                <User className="w-4 h-4" />
                                Mi Perfil
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="px-6 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
                        >
                            Acceso Socios
                        </Link>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile Nav */}
            <div className={cn(
                "md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border overflow-hidden transition-all duration-300 ease-in-out",
                isOpen ? "max-h-96" : "max-h-0"
            )}>
                <div className="flex flex-col p-4 gap-4">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-medium hover:text-primary py-2 transition-colors border-b border-border/50 last:border-0"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user ? (
                        <>
                            {isAdmin && (
                                <Link
                                    href="/admin/festeros"
                                    onClick={() => setIsOpen(false)}
                                    className="mt-2 w-full text-center py-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl font-bold border border-amber-500/20 flex items-center justify-center gap-2"
                                >
                                    <Settings className="w-4 h-4" />
                                    Gestión de Festeros
                                </Link>
                            )}
                            <Link
                                href="/perfil"
                                onClick={() => setIsOpen(false)}
                                className="mt-2 w-full text-center py-3 bg-primary/10 text-primary rounded-xl font-bold border border-primary/20"
                            >
                                Mi Perfil
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 w-full text-center py-3 bg-primary text-white rounded-xl font-bold shadow-sm"
                        >
                            Acceso Socios
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
