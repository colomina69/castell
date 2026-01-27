"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/utils/cn'

const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Historia', href: '/#historia' },
    { name: 'Galería', href: '/galeria' },
    { name: 'Actos', href: '/#actos' },
    { name: 'Contacto', href: '/#contacto' },
]

export function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-12 h-12">
                        <Image
                            src="/escudo.png"
                            alt="Escudo Fila Moros del Castell"
                            fill
                            className="object-contain"
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
                    <Link
                        href="/login"
                        className="px-6 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Acceso Socios
                    </Link>
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
                    <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="mt-2 w-full text-center py-3 bg-primary text-white rounded-xl font-semibold"
                    >
                        Acceso Socios
                    </Link>
                </div>
            </div>
        </header>
    )
}
