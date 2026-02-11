'use client'

import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function RemindButton({ scheduleId, unrespondedCount }: { scheduleId: string, unrespondedCount: number }) {
    const [loading, setLoading] = useState(false)

    const handleRemind = async () => {
        if (unrespondedCount === 0) {
            alert('未回答のメンバーはいません。')
            return
        }

        if (!confirm(`${unrespondedCount}名の未回答者にLINEで催促メッセージを送信しますか？\n※LINE連携済みのメンバーのみ対象です。`)) {
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/remind', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scheduleId })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || '送信に失敗しました')

            alert(`送信完了しました！\n対象: ${data.count}名`)
        } catch (e: any) {
            console.error(e)
            alert(`エラー: ${e.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleRemind}
            disabled={loading || unrespondedCount === 0}
            className={`
                inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white 
                ${loading || unrespondedCount === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}
            `}
        >
            <PaperAirplaneIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {loading ? '送信中...' : '未回答者に催促を送る'}
        </button>
    )
}
