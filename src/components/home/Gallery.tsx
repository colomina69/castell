"use client"

import { useEffect, useState, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'
import { Folder, X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react'

interface GalleryItem {
    name: string
    url: string
}

interface YearFolder {
    year: string
    coverUrl: string
    isRoot?: boolean
}

export function Gallery() {
    const [years, setYears] = useState<YearFolder[]>([])
    const [selectedYear, setSelectedYear] = useState<string | null>(null)
    const [images, setImages] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [lightboxImage, setLightboxImage] = useState<number | null>(null)

    const supabase = useMemo(() => createClient(), [])

    const fetchGalleryData = useCallback(async () => {
        setLoading(true)
        console.log('Sincronizando Galería con Supabase (Bucket: Fila)...')
        try {
            // List everything in the root of the 'Fila' bucket
            const { data, error } = await supabase.storage.from('Fila').list('', {
                sortBy: { column: 'name', order: 'desc' },
                limit: 100 // Adjust if there are many root items
            })

            if (error) {
                console.error('Error de Supabase Storage:', error)
                throw error
            }

            console.log('Items encontrados en la raíz:', data)

            const yearFolders: YearFolder[] = []
            const rootImages: GalleryItem[] = []

            for (const item of data || []) {
                // Determine if it's a "folder" or an image
                // In Supabase, items without metadata/id in the list results are usually folders
                const isFolder = !item.id && !item.metadata
                const isImageFile = item.metadata && item.metadata.mimetype?.startsWith('image/')

                if (isFolder || item.name.match(/^\d{4}$/)) {
                    const folderName = item.name
                    console.log(`Procesando álbum: ${folderName}`)

                    // Fetch the first image to use as cover
                    const { data: folderContents, error: folderError } = await supabase.storage.from('Fila').list(folderName, {
                        limit: 1
                    })

                    if (folderError) {
                        console.warn(`Error al leer carpeta ${folderName}:`, folderError)
                        continue
                    }

                    if (folderContents && folderContents.length > 0) {
                        const { data: { publicUrl } } = supabase.storage.from('Fila').getPublicUrl(`${folderName}/${folderContents[0].name}`)
                        yearFolders.push({ year: folderName, coverUrl: publicUrl })
                        console.log(`Álbum ${folderName} añadido con portada: ${publicUrl}`)
                    } else {
                        console.log(`Álbum ${folderName} parece estar vacío.`)
                        // Optional: show folders even if empty or find a way to show they are folders
                        // For now, only folders with images are added to UI
                    }
                } else if (isImageFile) {
                    const { data: { publicUrl } } = supabase.storage.from('Fila').getPublicUrl(item.name)
                    rootImages.push({ name: item.name, url: publicUrl })
                }
            }

            // Group root images into a "General" album if they exist
            if (rootImages.length > 0) {
                yearFolders.unshift({
                    year: 'General',
                    coverUrl: rootImages[0].url,
                    isRoot: true
                })
            }

            // Sort folders numerically (descending) if they are years
            yearFolders.sort((a, b) => {
                const yearA = parseInt(a.year)
                const yearB = parseInt(b.year)
                if (!isNaN(yearA) && !isNaN(yearB)) return yearB - yearA
                return a.year.localeCompare(b.year)
            })

            setYears(yearFolders)
            console.log('Estructura final de la galería:', { folders: yearFolders.map(f => f.year), rootImages: rootImages.length })
        } catch (err) {
            console.error('Error al cargar datos de la galería:', err)
        } finally {
            setLoading(false)
        }
    }, [supabase.storage])

    const fetchImages = useCallback(async (year: string, isRoot: boolean = false) => {
        setLoading(true)
        console.log(`Cargando fotos del álbum: ${year}`)
        try {
            const path = isRoot ? '' : year
            const { data, error } = await supabase.storage.from('Fila').list(path, {
                limit: 100 // Increase if more photos per year are expected
            })

            if (error) throw error

            const galleryItems = (data || [])
                .filter(item => item.metadata && item.metadata.mimetype?.startsWith('image/'))
                .map(img => {
                    const fullPath = isRoot ? img.name : `${year}/${img.name}`
                    const { data: { publicUrl } } = supabase.storage.from('Fila').getPublicUrl(fullPath)
                    return { name: img.name, url: publicUrl }
                })

            setImages(galleryItems)
            setSelectedYear(year)
            console.log(`Cargadas ${galleryItems.length} imágenes de ${year}`)
        } catch (err) {
            console.error('Error al cargar imágenes del álbum:', err)
        } finally {
            setLoading(false)
        }
    }, [supabase.storage])

    useEffect(() => {
        fetchGalleryData()
    }, [fetchGalleryData])

    const closeLightbox = () => setLightboxImage(null)
    const nextImage = () => setLightboxImage(prev => (prev !== null && prev < images.length - 1 ? prev + 1 : prev))
    const prevImage = () => setLightboxImage(prev => (prev !== null && prev > 0 ? prev - 1 : prev))

    if (loading && years.length === 0) {
        return (
            <div className="flex items-center justify-center py-32 bg-background">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                        <ImageIcon className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <p className="text-lg font-medium text-muted-foreground animate-pulse">Sincronizando álbumes históricos...</p>
                </div>
            </div>
        )
    }

    return (
        <section id="galeria" className="py-24 bg-background min-h-[60vh]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="font-display text-5xl font-bold text-primary mb-6">Galería de la Filà</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        Un recorrido visual por nuestra historia. Descubre los momentos emblemáticos de cada año.
                    </p>

                    {selectedYear && (
                        <button
                            onClick={() => setSelectedYear(null)}
                            className="mt-8 text-primary hover:text-white hover:bg-primary border border-primary/30 px-6 py-2 rounded-full transition-all flex items-center gap-2 mx-auto font-semibold shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5" /> Volver a los álbumes
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {!selectedYear ? (
                        <motion.div
                            key="folders"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full"
                        >
                            {years.length === 0 ? (
                                <div className="text-center py-24 px-8 rounded-3xl border-2 border-dashed border-border bg-muted/5 max-w-3xl mx-auto">
                                    <ImageIcon className="w-20 h-20 text-border mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold mb-3 text-foreground">Aún no hay álbumes visibles</h3>
                                    <p className="text-muted-foreground text-lg mb-8">
                                        Estamos procesando las imágenes del bucket &quot;Fila&quot;. Asegúrate de que las fotos estén organizadas por carpetas de años.
                                    </p>
                                    <button
                                        onClick={fetchGalleryData}
                                        className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95"
                                    >
                                        Reintentar Sincronización
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                                    {years.map((y, idx) => (
                                        <motion.div
                                            key={y.year}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            whileHover={{ y: -8 }}
                                            className="group cursor-pointer"
                                            onClick={() => fetchImages(y.year, y.isRoot)}
                                        >
                                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl mb-6 border border-white/10 ring-1 ring-black/5 transition-all group-hover:shadow-2xl">
                                                <Image
                                                    src={y.coverUrl}
                                                    alt={`Álbum del año ${y.year}`}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                                                        {y.isRoot ? <ImageIcon className="text-white w-10 h-10" /> : <Folder className="text-white w-10 h-10" />}
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-8">
                                                    <p className="text-white/60 text-sm font-medium mb-1 tracking-wider uppercase">Álbum</p>
                                                    <h3 className="text-white text-3xl font-bold font-display">{y.year}</h3>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="images"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="w-full"
                        >
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                                <h3 className="text-3xl font-display font-bold text-primary">Álbum: {selectedYear}</h3>
                                <p className="text-muted-foreground">{images.length} imágenes</p>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {images.map((img, idx) => (
                                    <motion.div
                                        key={img.url}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.03 }}
                                        whileHover={{ scale: 1.05 }}
                                        className="relative aspect-square rounded-2xl overflow-hidden shadow-lg cursor-pointer group border border-border/10 ring-1 ring-black/5"
                                        onClick={() => setLightboxImage(idx)}
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:rotate-2 group-hover:scale-110"
                                            sizes="(max-width: 768px) 50vw, 20vw"
                                        />
                                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Lightbox Pro */}
            <AnimatePresence>
                {lightboxImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/98 flex flex-col items-center justify-center p-4"
                    >
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[210] bg-gradient-to-b from-black/60 to-transparent">
                            <span className="text-white/80 font-medium">
                                {selectedYear} • {lightboxImage + 1} de {images.length}
                            </span>
                            <button
                                onClick={closeLightbox}
                                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all border border-white/10"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>

                        <button
                            disabled={lightboxImage === 0}
                            onClick={prevImage}
                            className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/15 text-white p-5 rounded-full disabled:opacity-10 transition-all z-[210] border border-white/5"
                        >
                            <ChevronLeft className="w-10 h-10" />
                        </button>

                        <button
                            disabled={lightboxImage === images.length - 1}
                            onClick={nextImage}
                            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/5 hover:bg-white/15 text-white p-5 rounded-full disabled:opacity-10 transition-all z-[210] border border-white/5"
                        >
                            <ChevronRight className="w-10 h-10" />
                        </button>

                        <div className="relative w-full h-[85vh] flex items-center justify-center">
                            <motion.div
                                key={lightboxImage}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="relative w-full h-full"
                            >
                                <Image
                                    src={images[lightboxImage].url}
                                    alt={images[lightboxImage].name}
                                    fill
                                    className="object-contain"
                                    priority
                                    quality={100}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
