import Link from 'next/link'
import { Instagram, Facebook, Mail } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-card text-foreground py-16 border-t border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="font-display text-2xl font-bold text-primary mb-4">Filà Moros del Castell</h3>
                        <p className="text-muted-foreground max-w-sm mb-6">
                            Manteniendo viva la tradición de los Moros y Cristianos en Benilloba.
                            Germanor, historia y pasión.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-all">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2">
                            <li><Link href="/#historia" className="text-muted-foreground hover:text-primary transition-colors">Historia</Link></li>
                            <li><Link href="/galeria" className="text-muted-foreground hover:text-primary transition-colors">Galería</Link></li>
                            <li><Link href="/#actos" className="text-muted-foreground hover:text-primary transition-colors">Actos</Link></li>
                            <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Acceso Socios</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li>Benilloba, Alicante</li>
                            <li>info@morosdelcastell.org</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Filà Moros del Castell. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
