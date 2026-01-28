import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Timeline, TimelineEvent } from "@/components/historia/Timeline"
import Image from "next/image"

export const metadata = {
    title: 'Próximos Actos | Moros del Castell',
    description: 'Calendario de eventos, actos y asambleas de la Filà Moros del Castell de Benilloba.',
}

const actsEvents: TimelineEvent[] = [
    {
        date: "22 de Febrero, 2026",
        title: "Mig Any de Festes",
        time: "10:00",
        location: "Plaza Mayor, Benilloba",
        description: "Celebración del medio año festero con almuerzo popular y pasacalle por las calles del pueblo.",
        image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800",
        type: 'festivo'
    },
    {
        date: "15 de Marzo, 2026",
        title: "Asamblea General Ordinaria",
        time: "19:00",
        location: "Sede de la Filà",
        description: "Reunión anual de todos los socios para tratar temas administrativos y organizativos de cara a las fiestas.",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800",
        type: 'administrativo'
    },
    {
        date: "10 de Abril, 2026",
        title: "Ensayo de Marchas Moras",
        time: "21:00",
        location: "Local de Ensayos",
        description: "Preparación musical para las próximas fiestas con nuestra banda oficial.",
        image: "https://images.unsplash.com/photo-1514525253344-f81bcd04ca9a?auto=format&fit=crop&q=80&w=800",
        type: 'cultural'
    },
    {
        date: "15 de Agosto, 2026",
        title: "Día de la Entrada",
        time: "18:00",
        location: "Calle Mayor",
        description: "El acto principal de nuestras fiestas de Moros y Cristianos. Desfile de gala con toda la filà.",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800",
        type: 'festivo'
    }
]

export default function ActsPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-primary/60 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1514525253344-f81bcd04ca9a?auto=format&fit=crop&q=80&w=1600"
                        alt="Actos y Eventos"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="container mx-auto px-4 relative z-20 text-center">
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                            Próximos Actos
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light drop-shadow-md">
                            Vive la fiesta paso a paso. Calendario de actividades y eventos de nuestra Filà.
                        </p>
                    </div>
                </section>

                <Timeline events={actsEvents} />

                <section className="py-20 bg-card/30">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-sm text-muted-foreground italic">
                            * Los horarios y ubicaciones pueden estar sujetos a cambios. Se informará oportunamente a través de los canales oficiales.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
