import { getLotteryDraws } from './actions'
import Link from 'next/link'
import { Plus, ChevronRight, Calendar, Ticket, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default async function LotteryPage() {
    const draws = await getLotteryDraws()

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-amber-900">Gestión de Lotería</h1>
                    <p className="text-muted-foreground mt-1">Administra los sorteos, series y asignaciones a festeros.</p>
                </div>
                <Link href="/admin/loteria/nuevo">
                    <Button className="bg-amber-900 hover:bg-amber-800">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Sorteo
                    </Button>
                </Link>
            </div>

            {draws && draws.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {draws.map((draw) => (
                        <Link key={draw.id} href={`/admin/loteria/${draw.id}`}>
                            <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-amber-200 cursor-pointer h-full">
                                <div className="absolute top-0 right-0 p-4">
                                    <Badge variant={draw.status === 'active' ? 'default' : draw.status === 'closed' ? 'secondary' : 'outline'} className={draw.status === 'active' ? 'bg-amber-600 hover:bg-amber-700' : ''}>
                                        {draw.status === 'active' ? 'Activo' : draw.status === 'closed' ? 'Cerrado' : 'Borrador'}
                                    </Badge>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-semibold text-xl text-card-foreground group-hover:text-amber-800 transition-colors">
                                            {draw.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {new Date(draw.draw_date).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-amber-50/50 p-2 rounded-lg">
                                            <p className="text-xs text-amber-800/70 font-medium uppercase">Precio</p>
                                            <p className="font-semibold text-lg">{draw.ticket_price}€</p>
                                        </div>
                                        <div className="bg-amber-50/50 p-2 rounded-lg">
                                            <p className="text-xs text-amber-800/70 font-medium uppercase">Recargo</p>
                                            <p className="font-semibold text-lg">+{draw.surcharge}€</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center text-sm font-medium text-amber-700 group-hover:translate-x-1 transition-transform">
                                    Gestionar asignaciones <ChevronRight className="ml-1 h-4 w-4" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-xl border-muted-foreground/25 bg-muted/20">
                    <div className="p-4 rounded-full bg-amber-50 mb-4">
                        <Ticket className="h-8 w-8 text-amber-900/50" />
                    </div>
                    <h3 className="text-lg font-semibold">No hay sorteos creados</h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                        Comienza creando un nuevo sorteo para gestionar la lotería de la Fila.
                    </p>
                    <Link href="/admin/loteria/nuevo" className="mt-6">
                        <Button variant="outline" className="border-amber-200 hover:bg-amber-50 hover:text-amber-900">
                            Crear mi primer sorteo
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
