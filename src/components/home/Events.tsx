"use client"

import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react'

interface Event {
    id: number
    title: string
    date: string
    time: string
    location: string
    description: string
    type: 'festivo' | 'administrativo' | 'cultural'
}

const events: Event[] = [
    {
        id: 1,
        title: "Mig Any de Festes",
        date: "22 de Febrero, 2026",
        time: "10:00",
        location: "Plaza Mayor, Benilloba",
        description: "Celebración del medio año festero con almuerzo popular y pasacalle.",
        type: 'festivo'
    },
    {
        id: 2,
        title: "Asamblea General Ordinaria",
        date: "15 de Marzo, 2026",
        time: "19:00",
        location: "Sede de la Filà",
        description: "Reunión anual de todos los socios para tratar temas administrativos y organizativos.",
        type: 'administrativo'
    },
    {
        id: 3,
        title: "Ensayo de Marchas Moras",
        date: "10 de Abril, 2026",
        time: "21:00",
        location: "Local de Ensayos",
        description: "Preparación musical para las próximas fiestas con nuestra banda.",
        type: 'cultural'
    },
    {
        id: 4,
        title: "Día de la Entrada",
        date: "15 de Agosto, 2026",
        time: "18:00",
        location: "Calle Mayor",
        description: "El acto principal de nuestras fiestas de Moros y Cristianos.",
        type: 'festivo'
    }
]

export function Events() {
    return (
        <section id="actos" className="py-24 bg-card/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold text-primary mb-4">Próximos Actos</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Mantente informado sobre todas las actividades, reuniones y eventos festivos de nuestra Filà.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                    {events.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-background border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                                {/* Date Badge */}
                                <div className="flex-shrink-0 w-24 h-24 rounded-2xl bg-primary/10 flex flex-col items-center justify-center text-primary border border-primary/20">
                                    <span className="text-sm font-bold uppercase tracking-tighter">
                                        {event.date.split(' ')[2]}
                                    </span>
                                    <span className="text-3xl font-bold leading-none">
                                        {event.date.split(' ')[0]}
                                    </span>
                                </div>

                                <div className="flex-grow">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                                            event.type === 'festivo' ? "bg-accent/10 text-accent" :
                                                event.type === 'administrativo' ? "bg-blue-500/10 text-blue-500" :
                                                    "bg-primary/10 text-primary"
                                        )}>
                                            {event.type}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                        {event.title}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-primary" />
                                            {event.time}h
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            {event.location}
                                        </div>
                                    </div>
                                    <p className="mt-4 text-muted-foreground leading-relaxed italic">
                                        &ldquo;{event.description}&rdquo;
                                    </p>
                                </div>

                                <div className="flex-shrink-0 flex items-center justify-end">
                                    <button className="p-3 rounded-full bg-muted group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-muted-foreground italic">
                        * Los horarios y ubicaciones pueden estar sujetos a cambios de última hora.
                    </p>
                </div>
            </div>
        </section>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
