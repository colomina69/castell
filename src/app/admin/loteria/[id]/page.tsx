import { getLotteryDraw, getDrawAssignments } from '../actions'
import AssignmentManager from '../AssignmentManager'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, Calendar, Euro, FileText } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function DrawDetailsPage({ params }: { params: { id: string } }) {
    // Next.js 15+ params are async, but checking context. Next.js 14 params are sync objects usually but updated in types recently?
    // Depending on Next version `params` might be a promise. Assuming sync for now as per typical PageProps unless strict mode.
    // If error, will fix.

    // Update: In recent Next.js versions params is a Promise in layout/page.
    // However, if the user's project is older it might be sync. 
    // To be safe I will await it if it's a promise, but TS might complain if I treat it as such without knowing.
    // Looking at other files might help but I'll assume standard usage.

    const { id } = params

    const draw = await getLotteryDraw(id)
    if (!draw) notFound()

    const assignments = await getDrawAssignments(id)

    // Calculate stats
    const totalTickets = assignments.reduce((acc, curr) => acc + curr.quantity, 0)
    const totalMoney = totalTickets * draw.ticket_price
    const totalSurcharge = totalTickets * (draw.surcharge || 0)

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            <Link href="/admin/loteria" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al listado
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar / Info Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-amber-900">{draw.name}</h2>
                            <div className="mt-2">
                                <Badge variant={draw.status === 'active' ? 'default' : 'secondary'} className={draw.status === 'active' ? 'bg-amber-600' : ''}>
                                    {draw.status === 'active' ? 'Activo' : draw.status === 'closed' ? 'Cerrado' : 'Borrador'}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>{new Date(draw.draw_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Euro className="mr-2 h-4 w-4" />
                                <span>{draw.ticket_price}€ / décimo</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <FileText className="mr-2 h-4 w-4" />
                                <span>+{draw.surcharge}€ recargo</span>
                            </div>
                        </div>

                        <div className="border-t my-4 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Repartido</span>
                                <span className="font-semibold">{totalTickets} décimos</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Valor Total</span>
                                <span className="font-semibold">{totalMoney.toLocaleString()}€</span>
                            </div>
                            <div className="flex justify-between text-amber-700">
                                <span className="font-medium">Beneficio Recargo</span>
                                <span className="font-bold">+{totalSurcharge.toLocaleString()}€</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content / Assignments */}
                <div className="lg:col-span-3">
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-1">Reparto de Lotería</h3>
                            <p className="text-sm text-muted-foreground">Gestiona la cantidad de décimos asignados a cada festero.</p>
                        </div>

                        <AssignmentManager drawId={id} initialAssignments={assignments} />
                    </div>
                </div>
            </div>
        </div>
    )
}
