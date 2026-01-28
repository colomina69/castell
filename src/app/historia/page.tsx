import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Timeline, TimelineEvent } from "@/components/historia/Timeline"
import Image from "next/image"

export const metadata = {
    title: 'Nuestra Historia | Moros del Castell',
    description: 'Conoce los hitos y la tradición de la Filà Moros del Castell de Benilloba a través del tiempo.',
}

const historyEvents: TimelineEvent[] = [
    {
        date: '1974',
        title: 'Fundación de la Filà',
        description: 'Un grupo de amigos apasionados por la fiesta decide fundar la Filà Moros del Castell, inspirados por la historia del antiguo castillo de Benilloba.',
        image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&q=80&w=800',
    },
    {
        date: '1985',
        title: 'Primer Traje Oficial',
        description: 'Se consolida el diseño del traje que hoy nos identifica, recuperando elementos tradicionales y colores que simbolizan nuestra tierra.',
        image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800',
    },
    {
        date: '1999',
        title: '25 Aniversario',
        description: 'Celebración de nuestras bodas de plata con un desfile extraordinario que quedó grabado en la memoria de todo el pueblo.',
        image: 'https://images.unsplash.com/photo-1514525253344-f81bcd04ca9a?auto=format&fit=crop&q=80&w=800',
    },
    {
        date: '2010',
        title: 'Nueva Sede Social',
        description: 'Inauguración de nuestra propia "cabila", un espacio de encuentro y hermandad para todos los festeros de la filà.',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
    },
    {
        date: '2024',
        title: '50 Años de Historia',
        description: 'Miramos al futuro con el mismo orgullo y compromiso con el que empezamos hace medio siglo, manteniendo viva la llama de la fiesta.',
        image: 'https://images.unsplash.com/photo-1464348342788-790263f6693a?auto=format&fit=crop&q=80&w=800',
    }
]

export default function HistoriaPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-primary/40 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1600"
                        alt="Historia Benilloba"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="container mx-auto px-4 relative z-20 text-center">
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg">
                            Nuestra Historia
                        </h1>
                        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light drop-shadow-md">
                            Medio siglo de tradición, germanor y pasión por las fiestas de Moros y Cristianos en Benilloba.
                        </p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="py-20 bg-card">
                    <div className="container mx-auto px-4 text-center max-w-3xl">
                        <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Desde 1974</span>
                        <h2 className="font-display text-4xl font-bold mb-8 text-primary">Un legado que perdura</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            La historia de los Moros del Castell es la historia de sus gentes. Nacida de la ilusión de un grupo de jóvenes en los años 70, nuestra filà ha crecido hasta convertirse en un referente de la fiesta en Benilloba, manteniendo siempre la esencia de la hermandad y el respeto por nuestras raíces.
                        </p>
                    </div>
                </section>

                <Timeline events={historyEvents} />
            </main>
            <Footer />
        </div>
    )
}
