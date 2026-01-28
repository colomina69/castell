"use client"

import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { AnimatePresence } from "framer-motion"
import { Toast, ToastType } from "./Toast"

function ToastList() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

    useEffect(() => {
        const error = searchParams.get("error")
        const message = searchParams.get("message")
        const success = searchParams.get("success")

        if (error) {
            setToast({ message: error, type: "error" })
            // Clean up URL
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete("error")
            const queryString = newParams.toString()
            router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
        } else if (message || success) {
            setToast({ message: message || success!, type: "success" })
            // Clean up URL
            const newParams = new URLSearchParams(searchParams.toString())
            newParams.delete("message")
            newParams.delete("success")
            const queryString = newParams.toString()
            router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false })
        }
    }, [searchParams, pathname, router])

    return (
        <AnimatePresence>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </AnimatePresence>
    )
}

export function ToastListener() {
    return (
        <Suspense fallback={null}>
            <ToastList />
        </Suspense>
    )
}
