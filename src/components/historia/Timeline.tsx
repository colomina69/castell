"use client"

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import Image from 'next/image'
import { ReactNode } from 'react'

export interface TimelineEvent {
    date: string
    title: string
    description: string
    image?: string
    side?: 'left' | 'right'
    time?: string
    location?: string
    type?: string
}

interface TimelineProps {
    events: TimelineEvent[]
    alternate?: boolean
}

export function Timeline({ events, alternate = true }: TimelineProps) {
    return (
        <section className="py-20 bg-background overflow-hidden">
            <div className="container mx-auto px-4 relative">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 hidden md:block" />

                <div className="space-y-16 md:space-y-32">
                    {events.map((event, index) => {
                        const side = event.side || (alternate ? (index % 2 === 0 ? 'left' : 'right') : 'left')

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                className={`flex flex-col ${side === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
                            >
                                {/* Content Side */}
                                <div className={`w-full md:w-1/2 ${side === 'left' ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className={`inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary font-bold mb-4 ${side === 'left' ? 'md:flex-row-reverse' : ''}`}>
                                        <Calendar className="w-4 h-4" />
                                        <span>{event.date}</span>
                                    </div>
                                    <h3 className="font-display text-3xl font-bold mb-4 text-primary">{event.title}</h3>

                                    {(event.time || event.location) && (
                                        <div className={`flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground ${side === 'left' ? 'md:justify-end' : 'md:justify-start'}`}>
                                            {event.time && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4 text-secondary" />
                                                    {event.time}
                                                </div>
                                            )}
                                            {event.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4 text-secondary" />
                                                    {event.location}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Center Dot (Desktop Only) */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background hidden md:block z-10 shadow-lg" />

                                {/* Image Side */}
                                <div className="w-full md:w-1/2">
                                    <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video group">
                                        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply group-hover:bg-transparent transition-all duration-500" />
                                        {event.image ? (
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <Calendar className="w-12 h-12 text-primary/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity md:hidden">
                                            <span className="text-white font-bold">{event.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
