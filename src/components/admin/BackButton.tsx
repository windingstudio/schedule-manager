'use client'

import { useRouter } from 'next/navigation'

export default function BackButton({ href = '/admin' }: { href?: string }) {
    const router = useRouter()

    return (
        <button
            onClick={() => router.push(href)}
            className="mb-4 inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            戻る
        </button>
    )
}
