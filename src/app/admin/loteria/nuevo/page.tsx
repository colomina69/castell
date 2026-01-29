import { createLotteryDraw } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewLotteryPage() {
    return (
        <div className="container mx-auto py-10 px-4 max-w-2xl">
            <Link href="/admin/loteria" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
            </Link>

            <div className="bg-card border rounded-xl shadow-sm p-6 md:p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-amber-900">Crear Nuevo Sorteo</h1>
                    <p className="text-muted-foreground mt-1">Define los detalles del sorteo para empezar a gestionar la lotería.</p>
                </div>

                <form action={createLotteryDraw} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Sorteo</Label>
                        <Input id="name" name="name" placeholder="Ej: Lotería Navidad 2025" required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="draw_date">Fecha del Sorteo</Label>
                            <Input id="draw_date" name="draw_date" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado Inicial</Label>
                            <select
                                id="status"
                                name="status"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="draft">Borrador</option>
                                <option value="active">Activo</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="ticket_price">Precio por Décimo (€)</Label>
                            <Input id="ticket_price" name="ticket_price" type="number" step="0.01" min="0" placeholder="20.00" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="surcharge">Recargo por Décimo (€)</Label>
                            <Input id="surcharge" name="surcharge" type="number" step="0.01" min="0" placeholder="3.00" defaultValue="0" />
                            <p className="text-xs text-muted-foreground">Cantidad extra que se cobra a favor de la Fila.</p>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <Link href="/admin/loteria">
                            <Button variant="outline" type="button">Cancelar</Button>
                        </Link>
                        <Button type="submit" className="bg-amber-900 hover:bg-amber-800">
                            <Save className="mr-2 h-4 w-4" /> Guardar Sorteo
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
