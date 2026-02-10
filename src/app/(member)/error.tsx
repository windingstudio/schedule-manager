'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-red-50">
            <h2 className="text-xl font-bold text-red-800 mb-2">予期せぬエラーが発生しました</h2>
            <p className="text-red-600 mb-6 text-sm">{error.message || '不明なエラー'}</p>
            <div className="flex gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded-lg font-bold transition-colors"
                >
                    もう一度試す
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                    ページを再読み込み
                </button>
            </div>
        </div>
    )
}
