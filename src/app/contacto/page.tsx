import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { MapPin, Mail, Phone, Instagram, Facebook, Clock } from "lucide-react"
import Image from "next/image"

export const metadata = {
    title: 'Contacto | Moros del Castell',
    description: 'Contacta con la Filà Moros del Castell de Benilloba. Ubicación, email y redes sociales.',
}

export default function ContactoPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow pt-20">
                {/* Hero Section */}
                <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-primary/60 z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=1600"
                        alt="Contacto Moros del Castell"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="container mx-auto px-4 relative z-20 text-center">
                        <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
                            Contacto
                        </h1>
                        <p className="text-xl text-white/90 max-w-2xl mx-auto font-light drop-shadow-md">
                            Estamos aquí para escucharte. Contacta con nosotros para cualquier duda o información.
                        </p>
                    </div>
                </section>

                <section className="py-20 bg-background">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            {/* Contact Info */}
                            <div className="space-y-12">
                                <div>
                                    <h2 className="font-display text-4xl font-bold text-primary mb-8">Información de Contacto</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="flex gap-4 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Nuestra Sede</h4>
                                                <p className="text-muted-foreground">Benilloba, Alicante</p>
                                                <p className="text-muted-foreground">C.P. 03810</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Mail className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Email</h4>
                                                <a href="mailto:info@morosdelcastell.org" className="text-muted-foreground hover:text-primary transition-colors">
                                                    info@morosdelcastell.org
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Phone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Teléfono</h4>
                                                <p className="text-muted-foreground">+34 000 000 000</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 group">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <Clock className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Atención</h4>
                                                <p className="text-muted-foreground">Días de Asamblea</p>
                                                <p className="text-muted-foreground">19:00 - 21:00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-bold text-primary mb-6">Síguenos en Redes</h3>
                                    <div className="flex gap-4">
                                        <a href="#" className="flex items-center gap-3 px-6 py-3 bg-muted rounded-xl hover:bg-primary hover:text-white transition-all font-medium">
                                            <Instagram className="w-5 h-5" />
                                            Instagram
                                        </a>
                                        <a href="#" className="flex items-center gap-3 px-6 py-3 bg-muted rounded-xl hover:bg-primary hover:text-white transition-all font-medium">
                                            <Facebook className="w-5 h-5" />
                                            Facebook
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white dark:border-card h-[500px] lg:h-full min-h-[400px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12513.7533869273!2d-0.3995814!3d38.6997637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd618d7ef0201205%3A0xe54ef5a9bb6b5952!2s03810%20Benilloba%2C%20Alicante!5e0!3m2!1ses!2ses!4v1700000000000"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="filter grayscale contrast-125"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
