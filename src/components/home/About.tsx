"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'

export function About() {
    return (
        <section id="historia" className="py-24 bg-card">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <h2 className="font-display text-4xl font-bold mb-6 text-primary">Tradición y Orgullo</h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            La Filà Moros del Castell de Benilloba es una institución con profundas raíces en nuestra fiesta.
                            Nacida de la pasión por transformar la historia en leyenda, nuestra filà representa el espíritu
                            del guerrero y la germanor de un pueblo.
                        </p>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Cada año, bajo la sombra del Castell, desfilamos con orgullo portando nuestros colores,
                            manteniendo vivas las tradiciones que nos definen y fortaleciendo los lazos que nos unen
                            a nuestra tierra.
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="border-l-4 border-primary pl-4">
                                <span className="block text-3xl font-bold font-display">Benilloba</span>
                                <span className="text-muted-foreground uppercase text-xs tracking-wider">Origen</span>
                            </div>
                            <div className="border-l-4 border-secondary pl-4">
                                <span className="block text-3xl font-bold font-display">Castell</span>
                                <span className="text-muted-foreground uppercase text-xs tracking-wider">Identidad</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="w-full md:w-1/2"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
                            <div className="absolute inset-0 bg-primary/20 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                            <Image
                                src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800"
                                alt="Moros y Cristianos Tradición"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
