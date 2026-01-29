'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateAssignment, bulkAssign } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Save, Users } from 'lucide-react'

type Assignment = {
    festero_id: string
    festero_name: string
    assignment_id: string | null
    quantity: number
    amount_paid: number
    status: string
}

export default function AssignmentManager({
    drawId,
    initialAssignments
}: {
    drawId: string,
    initialAssignments: Assignment[]
}) {
    const [assignments, setAssignments] = useState(initialAssignments)
    const [searchTerm, setSearchTerm] = useState('')
    const [bulkQuantity, setBulkQuantity] = useState(0)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const filteredAssignments = assignments.filter(a =>
        a.festero_name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleQuantityChange = (festeroId: string, newQuantity: number) => {
        setAssignments(prev => prev.map(a =>
            a.festero_id === festeroId ? { ...a, quantity: newQuantity } : a
        ))
    }

    const handleSaveRow = async (festeroId: string, quantity: number) => {
        try {
            await updateAssignment(drawId, festeroId, quantity)
            router.push(`?success=Asignación guardada correctamente`)
        } catch (error) {
            console.error(error)
            router.push(`?error=Error al guardar la asignación`)
        }
    }

    const handleBulkAssign = async () => {
        if (!confirm(`¿Estás seguro de asignar ${bulkQuantity} décimos a TODOS los festeros? Esto actualizará las cantidades existentes.`)) return

        setLoading(true)
        try {
            await bulkAssign(drawId, bulkQuantity)
            router.push(`?success=Asignación masiva completada`)
            // router.refresh() handles the server state update, and ToastListener will show the message
            setTimeout(() => router.refresh(), 100)
        } catch (error) {
            console.error(error)
            router.push(`?error=Error en la asignación masiva`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-end bg-muted/20 p-4 rounded-xl border">
                <div className="w-full md:w-1/3">
                    <label className="text-sm font-medium mb-1 block">Buscar Festero</label>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-end gap-2 w-full md:w-auto">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Asignación Masiva</label>
                        <Input
                            type="number"
                            min="0"
                            className="w-32"
                            placeholder="Cant."
                            value={bulkQuantity}
                            onChange={(e) => setBulkQuantity(parseInt(e.target.value) || 0)}
                        />
                    </div>
                    <Button onClick={handleBulkAssign} disabled={loading || bulkQuantity <= 0} className="bg-amber-900 hover:bg-amber-800">
                        <Users className="mr-2 h-4 w-4" /> Asignar a Todos
                    </Button>
                </div>
            </div>

            <div className="border rounded-xl overflow-hidden shadow-sm bg-card">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 sticky top-0 z-10">
                            <tr className="border-b">
                                <th className="text-left p-4 font-medium text-muted-foreground w-1/2">Festero</th>
                                <th className="text-center p-4 font-medium text-muted-foreground">Cantidad (Décimos)</th>
                                <th className="text-center p-4 font-medium text-muted-foreground">Estado</th>
                                <th className="text-right p-4 font-medium text-muted-foreground">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredAssignments.map((assignment) => (
                                <tr key={assignment.festero_id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{assignment.festero_name}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <Button
                                                variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                                onClick={() => {
                                                    const val = Math.max(0, assignment.quantity - 1)
                                                    handleQuantityChange(assignment.festero_id, val)
                                                }}
                                            >-</Button>
                                            <Input
                                                type="number"
                                                min="0"
                                                className="w-16 text-center h-9"
                                                value={assignment.quantity}
                                                onChange={(e) => handleQuantityChange(assignment.festero_id, parseInt(e.target.value) || 0)}
                                            />
                                            <Button
                                                variant="outline" size="icon" className="h-8 w-8 rounded-full"
                                                onClick={() => {
                                                    const val = assignment.quantity + 1
                                                    handleQuantityChange(assignment.festero_id, val)
                                                }}
                                            >+</Button>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${assignment.quantity > 0
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {assignment.quantity > 0 ? 'Asignado' : 'Sin asignar'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleSaveRow(assignment.festero_id, assignment.quantity)}
                                            className="hover:bg-amber-100 hover:text-amber-900"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAssignments.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                        No se encontraron festeros con ese nombre.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
