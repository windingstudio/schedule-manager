'use client'

import { useLiff } from '@/components/LiffProvider'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import {
    CalendarIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline'

type Schedule = {
    id: string
    date: string
    start_time: string
    end_time: string
    place: string
    content: string
    note: string
}

type Member = {
    id: string
    name: string
    part: string
}

type Attendance = {
    schedule_id: string
    status: string
    comment: string
    returned_home_at?: string
}

// Force dynamic rendering to prevent aggressive caching
export const dynamic = 'force-dynamic'

export default function MemberDashboard() {
    const { liff, isLoggedIn, error } = useLiff()
    const [loading, setLoading] = useState(true)
    const [currentMember, setCurrentMember] = useState<Member | null>(null)
    const [schedules, setSchedules] = useState<Schedule[]>([])
    const [unlinkedMembers, setUnlinkedMembers] = useState<Member[]>([])
    const [myAttendances, setMyAttendances] = useState<Record<string, Attendance>>({})
    const [now, setNow] = useState(new Date())

    const supabase = createClient()

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 60000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const checkUserLink = async () => {
            setLoading(true)
            try {
                const lineUserId = await liff?.getProfile().then(profile => profile.userId)

                if (!lineUserId) {
                    setLoading(false)
                    return
                }

                // Check if member exists with this LINE ID
                const { data: member } = await supabase
                    .from('members')
                    .select('*')
                    .eq('line_user_id', lineUserId)
                    .single()

                if (member) {
                    setCurrentMember(member)
                    fetchSchedules(member.id)
                } else {
                    // Not linked yet, fetch all unlinked members for selection
                    fetchUnlinkedMembers()
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }

        if (isLoggedIn && liff) {
            checkUserLink()
        } else {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, liff])

    const fetchUnlinkedMembers = async () => {
        const { data } = await supabase.from('members').select('*').is('line_user_id', null).order('part')
        if (data) setUnlinkedMembers(data)
    }

    const fetchSchedules = async (memberId: string) => {
        // Fetch future schedules
        const { data: scheds } = await supabase
            .from('schedules')
            .select('*')
            .gte('date', new Date().toISOString())
            .order('date', { ascending: true })

        if (scheds) setSchedules(scheds)

        // Fetch my attendances
        const { data: atts } = await supabase
            .from('attendances')
            .select('*')
            .eq('member_id', memberId)

        if (atts) {
            const map: Record<string, Attendance> = {}
            atts.forEach(a => map[a.schedule_id] = a)
            setMyAttendances(map)
        }
    }

    const handleLinkUser = async (memberId: string) => {
        if (!confirm('本当にこのメンバーで登録しますか？（後から変更するのは大変です）')) return

        const lineUserId = await liff?.getProfile().then(profile => profile.userId)
        if (!lineUserId) return

        const { error } = await supabase
            .from('members')
            .update({ line_user_id: lineUserId })
            .eq('id', memberId)

        if (!error) {
            alert('登録が完了しました！')
            window.location.reload()
        } else {
            alert('登録に失敗しました。もう一度お試しください。')
        }
    }

    const handleReportHome = async (scheduleId: string) => {
        if (!currentMember) return
        if (!confirm('帰宅報告をしますか？')) return

        const currentAttendance = myAttendances[scheduleId] || { schedule_id: scheduleId, status: 'unresponded', comment: '' }
        const timestamp = new Date().toISOString()

        // Optimistic update
        setMyAttendances(prev => ({
            ...prev,
            [scheduleId]: { ...currentAttendance, returned_home_at: timestamp }
        }))

        const { error } = await supabase
            .from('attendances')
            .upsert({
                schedule_id: scheduleId,
                member_id: currentMember.id,
                status: currentAttendance.status,
                comment: currentAttendance.comment,
                returned_home_at: timestamp,
                updated_at: timestamp
            }, { onConflict: 'schedule_id,member_id' })

        if (error) {
            alert('エラーが発生しました')
            console.error(error)
        }
    }

    const handleAttendanceChange = async (scheduleId: string, status?: string, comment?: string) => {
        if (!currentMember) return

        try {
            // Current state
            const currentAttendance = myAttendances[scheduleId] || { schedule_id: scheduleId, status: 'unresponded', comment: '' }

            // determine new values
            const newStatus = status !== undefined ? status : currentAttendance.status
            const newComment = comment !== undefined ? comment : currentAttendance.comment

            // Optimistic update
            setMyAttendances(prev => ({
                ...prev,
                [scheduleId]: { ...currentAttendance, status: newStatus, comment: newComment }
            }))

            const { error } = await supabase
                .from('attendances')
                .upsert({
                    schedule_id: scheduleId,
                    member_id: currentMember.id,
                    status: newStatus,
                    comment: newComment,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'schedule_id,member_id' })

            if (error) {
                throw error
            }
        } catch (e: any) {
            console.error(e)
            // Revert optional? For now just alert
            // alert(`エラーが発生しました: ${e.message || JSON.stringify(e)}`)
        }
    }

    if (error) return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">エラーが発生しました: {error}</div>
        </div>
    )

    if (loading) return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
        </div>
    )

    // Not logged in to LINE (Web browser or external browser)
    if (!isLoggedIn) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-green-600">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 13.41L17.59 5.82L19 7.23L10 17Z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900">楽団スケジュール管理</h1>
                <p className="mb-8 text-gray-600">LINEアプリからアクセスしてください。</p>
                <button
                    onClick={() => liff?.login()}
                    className="w-full max-w-xs bg-[#06C755] hover:bg-[#05b34c] text-white py-3 px-6 rounded-xl font-bold shadow-sm transition-all active:scale-95"
                >
                    LINEログイン
                </button>
            </div>
        )
    }

    // Logged in but not linked
    if (!currentMember) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 pb-20">
                <header className="mb-6 pt-4">
                    <h1 className="text-2xl font-bold text-gray-900">ようこそ！</h1>
                    <p className="text-gray-600 mt-2">初回設定を行います。<br />リストから自分の名前を選択してください。</p>
                </header>

                {unlinkedMembers.length === 0 ? (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <p className="text-gray-500 mb-2">選択可能なメンバーが見つかりません</p>
                        <p className="text-sm text-gray-400">管理者に問い合わせてください</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {unlinkedMembers.map(member => (
                            <li key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg text-gray-900">{member.name}</p>
                                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-1">{member.part}</span>
                                </div>
                                <button
                                    onClick={() => handleLinkUser(member.id)}
                                    className="bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
                                >
                                    これです
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        )
    }

    const formatDate = (dateStr: string) => {
        try {
            if (!dateStr) return '日付未定'
            const d = new Date(dateStr)
            if (isNaN(d.getTime())) return '日付不明'

            // Manual formatting to avoid hydration mismatch (Server vs Client locale diffs)
            const month = d.getMonth() + 1
            const day = d.getDate()
            const weekdays = ['日', '月', '火', '水', '木', '金', '土']
            const weekday = weekdays[d.getDay()]

            return `${month}/${day}(${weekday})`
        } catch (e) {
            console.error('Date parsing error', e)
            return dateStr
        }
    }

    // Main Dashboard
    return (
        <div className="bg-gray-50 min-h-screen pb-24">
            <header className="bg-white shadow-sm px-4 py-3 sticky top-0 z-20 flex justify-between items-center backdrop-blur-md bg-white/90 supports-[backdrop-filter]:bg-white/60">
                <h1 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-indigo-600" />
                    マイスケジュール
                </h1>
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <UserCircleIcon className="w-4 h-4 text-gray-400" />
                    <div className="text-xs text-right">
                        <span className="font-medium text-gray-900 block">{currentMember?.name || 'ゲスト'}</span>
                    </div>
                </div>
            </header>

            <main className="p-4 space-y-5 mt-2">
                {schedules.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                            <CalendarIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">これからの予定はありません</p>
                    </div>
                )}

                {schedules.map(schedule => {
                    const myStatus = myAttendances[schedule.id]?.status || null
                    const returnedHomeAt = myAttendances[schedule.id]?.returned_home_at

                    // Check if practice has ended
                    const scheduleEndDate = new Date(`${schedule.date}T${schedule.end_time}`)
                    const isPracticeEnded = now > scheduleEndDate

                    return (
                        <div key={schedule.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md">
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-gray-900 tracking-tight" suppressHydrationWarning>
                                            {formatDate(schedule.date)}
                                        </span>
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                                            <span className="text-sm font-medium font-mono">
                                                {(schedule.start_time || '').slice(0, 5) + ' - ' + (schedule.end_time || '').slice(0, 5)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full flex items-center border border-indigo-100">
                                        <MapPinIcon className="w-3 h-3 mr-1" />
                                        {schedule.place}
                                    </div>
                                </div>

                                <hr className="border-gray-100 my-3" />

                                <h3 className="text-gray-900 font-bold mb-2">{schedule.content}</h3>
                                {schedule.note && (
                                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 leading-relaxed">
                                        {schedule.note}
                                    </div>
                                )}
                            </div>

                            {/* Action Area */}
                            <div className="px-4 pb-4 pt-1">
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <button
                                        onClick={() => handleAttendanceChange(schedule.id, 'attendance')}
                                        className={`
                        relative flex items-center justify-center py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95
                        ${myStatus === 'attendance'
                                                ? 'bg-green-600 text-white shadow-md shadow-green-200 ring-2 ring-green-600 ring-offset-2'
                                                : 'bg-white text-gray-600 border-2 border-gray-100 hover:bg-gray-50'}
                    `}
                                    >
                                        {myStatus === 'attendance' && <CheckCircleIcon className="w-5 h-5 mr-1.5" />}
                                        出席
                                    </button>
                                    <button
                                        onClick={() => handleAttendanceChange(schedule.id, 'absence')}
                                        className={`
                        relative flex items-center justify-center py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 active:scale-95
                        ${myStatus === 'absence'
                                                ? 'bg-red-500 text-white shadow-md shadow-red-200 ring-2 ring-red-500 ring-offset-2'
                                                : 'bg-white text-gray-600 border-2 border-gray-100 hover:bg-gray-50'}
                    `}
                                    >
                                        {myStatus === 'absence' && <XCircleIcon className="w-5 h-5 mr-1.5" />}
                                        欠席
                                    </button>
                                </div>

                                {/* Report Home Button */}
                                <div className="mb-3">
                                    {returnedHomeAt ? (
                                        <div className="w-full bg-blue-50 text-blue-600 py-3 rounded-xl font-bold text-sm text-center border border-blue-100">
                                            🏠 帰宅報告済み ({new Date(returnedHomeAt).getHours()}:{String(new Date(returnedHomeAt).getMinutes()).padStart(2, '0')})
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleReportHome(schedule.id)}
                                            disabled={!isPracticeEnded}
                                            className={`
                                                w-full flex items-center justify-center py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200
                                                ${isPracticeEnded
                                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-100 hover:bg-orange-600 active:scale-95'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
                                            `}
                                        >
                                            🏠 帰宅報告 {isPracticeEnded ? '' : '(終了まで押せません)'}
                                        </button>
                                    )}
                                </div>

                                {/* Comment Field */}
                                <div className="mt-4">
                                    <label htmlFor={`comment-${schedule.id}`} className="block text-xs font-medium text-gray-700 mb-1 ml-1">
                                        コメント・備考
                                    </label>
                                    <textarea
                                        id={`comment-${schedule.id}`}
                                        placeholder="遅刻の理由や連絡事項があれば入力..."
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900"
                                        rows={2}
                                        value={myAttendances[schedule.id]?.comment || ''}
                                        onChange={(e) => {
                                            const val = e.target.value
                                            setMyAttendances(prev => ({
                                                ...prev,
                                                [schedule.id]: {
                                                    ...prev[schedule.id],
                                                    schedule_id: schedule.id, // Ensure ID is present
                                                    status: prev[schedule.id]?.status || 'unresponded', // Default status
                                                    comment: val
                                                }
                                            }))
                                        }}
                                        onBlur={() => handleAttendanceChange(schedule.id, undefined, myAttendances[schedule.id]?.comment)}
                                    />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </main>
        </div>
    )
}
