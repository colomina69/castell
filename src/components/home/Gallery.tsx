"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Folder } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { cn } from '@/utils/cn'

interface GalleryItem {
    name: string
    url: string
}

interface YearFolder {
    year: string
    coverUrl: string
}

export function Gallery() {
    const [years, setYears] = useState<YearFolder[]>([])
    const [selectedYear, setSelectedYear] = useState<string | null>(null)
    const [images, setImages] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [lightboxImage, setLightboxImage] = useState<number | null>(null)
    const supabase = createClient()

    useEffect(() => {
        fetchYears()
    }, [])

    async function fetchYears() {
        setLoading(true)
        console.log('Fetching years from Supabase Storage...')
        try {
            const { data, error } = await supabase.storage.from('fila').list('', {
                sortBy: { column: 'name', order: 'desc' }
            })

            if (error) {
                console.error('Supabase storage error:', error)
                throw error
            }

            console.log('Storage data received:', data)

            const yearFolders: YearFolder[] = []

            for (const item of data || []) {
                // Determine if it's a folder: folders usually don't have id/metadata
                const isFolder = !item.id && !item.metadata

                if (isFolder || item.name.match(/^\d{4}$/)) {
                    console.log(`Checking folder: ${item.name}`)
                    const { data: firstImg, error: listError } = await supabase.storage.from('fila').list(item.name, {
                        limit: 1
                    })

                    if (listError) {
                        console.warn(`Error listing folder ${item.name}:`, listError)
                        continue
                    }

                    if (firstImg && firstImg.length > 0) {
                        const { data: { publicUrl } } = supabase.storage.from('fila').getPublicUrl(`${item.name}/${firstImg[0].name}`)
                        yearFolders.push({ year: item.name, coverUrl: publicUrl })
                        console.log(`Folder ${item.name} added with cover ${publicUrl}`)
                    } else {
                        console.log(`Folder ${item.name} is empty or has no accessible images.`)
                    }
                }
            }

            setYears(yearFolders)
            console.log('Final year folders list:', yearFolders)
        } catch (err) {
            console.error('Error in fetchYears:', err)
        } finally {
            setLoading(false)
        }
    }

    async function fetchImages(year: string) {
        setLoading(true)
        console.log(`Fetching images for year: ${year}`)
        try {
            const { data, error } = await supabase.storage.from('fila').list(year)
            if (error) throw error

            const galleryItems = (data || [])
                .filter(img => img.name !== '.emptyFolderPlaceholder')
                .map(img => {
                    const { data: { publicUrl } } = supabase.storage.from('fila').getPublicUrl(`${year}/${img.name}`)
                    return { name: img.name, url: publicUrl }
                })

            setImages(galleryItems)
            setSelectedYear(year)
            console.log(`Loaded ${galleryItems.length} images for ${year}`)
        } catch (err) {
            console.error('Error fetching images:', err)
        } finally {
            setLoading(false)
        }
    }

    const closeLightbox = () => setLightboxImage(null)
    const nextImage = () => setLightboxImage(prev => (prev !== null && prev < images.length - 1 ? prev + 1 : prev))
    const prevImage = () => setLightboxImage(prev => (prev !== null && prev > 0 ? prev - 1 : prev))

    if (loading && years.length === 0) {
        return (
            <div className="flex items-center justify-center py-24 bg-muted/30">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Cargando galería...</p>
                </div>
            </div>
        )
    }

    return (
        <section id="galeria" className="py-24 bg-background border-t border-border/50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl font-bold text-primary mb-4">Galería Histórica</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Explora los momentos más memorables de nuestra Filà a través de los años.
                    </p>

                    {selectedYear && (
                        <button
                            onClick={() => setSelectedYear(null)}
                            className="mt-6 text-primary hover:text-primary/80 flex items-center gap-2 mx-auto font-medium transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" /> Volver al índice de años
                        </button>
                    )}
                </div>

                {/* Year Grid */}
                {!selectedYear ? (
                    <div className="min-h-[300px] flex items-center justify-center w-full">
                        {years.length === 0 ? (
                            <div className="text-center py-16 px-8 rounded-3xl border-2 border-dashed border-border bg-muted/10 w-full max-w-2xl">
                                <Folder className="w-16 h-16 text-border mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No hay álbumes todavía</h3>
                                <p className="text-muted-foreground mb-6">
                                    Para comenzar, crea carpetas por años (ej: 2024) en el bucket "fila" de Supabase y sube algunas fotos.
                                </p>
                                <div className="inline-flex items-center gap-2 text-primary font-medium text-sm">
                                    Esperando contenido...
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                                {years.map((y) => (
                                    <motion.div
                                        key={y.year}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        whileHover={{ y: -10 }}
                                        className="group cursor-pointer"
                                        onClick={() => fetchImages(y.year)}
                                    >
                                        <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg mb-4">
                                            <Image
                                                src={y.coverUrl}
                                                alt={`Año ${y.year}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Folder className="text-white w-12 h-12" />
                                            </div>
                                        </div>
                                        <h3 className="font-display text-2xl font-bold text-center group-hover:text-primary transition-colors">
                                            {y.year}
                                        </h3>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Image Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((img, idx) => (
                            <motion.div
                                key={img.url}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="relative aspect-square rounded-xl overflow-hidden shadow-md cursor-pointer group"
                                onClick={() => setLightboxImage(idx)}
                            >
                                <Image
                                    src={img.url}
                                    alt={img.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {lightboxImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
                    >
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 text-white hover:text-primary transition-colors z-[110]"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <button
                            disabled={lightboxImage === 0}
                            onClick={prevImage}
                            className="absolute left-6 text-white hover:text-primary disabled:opacity-30 z-[110]"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <button
                            disabled={lightboxImage === images.length - 1}
                            onClick={nextImage}
                            className="absolute right-6 text-white hover:text-primary disabled:opacity-30 z-[110]"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        <div className="relative w-full h-full">
                            <Image
                                src={images[lightboxImage].url}
                                alt={images[lightboxImage].name}
                                fill
                                className="object-contain"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
