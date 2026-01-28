"use client"

import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background patterns/gradients */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative w-48 h-48 md:w-64 md:h-64 mb-8"
                >
                    <Image
                        src="/escudo.png"
                        alt="Escudo Fila Moros del Castell"
                        fill
                        priority
                        unoptimized={true}
                        className="object-contain drop-shadow-2xl"
                        style={{
                            imageRendering: '-webkit-optimize-contrast',
                            transform: 'translateZ(0)'
                        }}
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="font-display text-4xl md:text-7xl font-bold mb-4 tracking-tight"
                >
                    Filà <span className="text-primary italic">Moros del Castell</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
                >
                    Benillobers orgullosos de nuestra historia, tradición y germanor desde el corazón del Castell.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                >
                    <a
                        href="#historia"
                        className="px-8 py-3 bg-primary text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1"
                    >
                        Nuestra Historia
                    </a>
                    <a
                        href="#contacto"
                        className="px-8 py-3 border-2 border-primary text-primary rounded-full font-semibold hover:bg-primary/5 transition-all"
                    >
                        Contáctanos
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="absolute bottom-10 animate-bounce"
                >
                    <ChevronDown className="text-muted-foreground w-8 h-8" />
                </motion.div>
            </div>
        </section>
    )
}
