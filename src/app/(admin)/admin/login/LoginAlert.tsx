'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function LoginAlert() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const alertShownRef = useRef(false)

    useEffect(() => {
        const message = searchParams.get('message')
        if (message && !alertShownRef.current) {
            alertShownRef.current = true
            // Use setTimeout to ensure the alert allows the page to render first/doesn't block immediately if possible
            setTimeout(() => {
                alert(message)
                // Optional: Clear the query param so it doesn't show again on refresh?
                // But user might want to see it again if they refresh. 
                // However, "Replace" might be good UX. 
                // For now, keep it simple.
            }, 100)
        }
    }, [searchParams])

    return null
}
