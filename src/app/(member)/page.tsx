'use client'

import { useLiff } from '@/components/LiffProvider'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

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
}

export default function Home() {
  const { liff, isLoggedIn, error } = useLiff()
  const [loading, setLoading] = useState(true)
  const [currentMember, setCurrentMember] = useState<Member | null>(null)
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [unlinkedMembers, setUnlinkedMembers] = useState<Member[]>([])
  const [myAttendances, setMyAttendances] = useState<Record<string, Attendance>>({})

  const supabase = createClient()

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

  const handleAttendanceChange = async (scheduleId: string, status: string) => {
    if (!currentMember) return

    // Optimistic update
    const newAttendance = { schedule_id: scheduleId, status, comment: myAttendances[scheduleId]?.comment || '' }
    setMyAttendances(prev => ({ ...prev, [scheduleId]: newAttendance }))

    const { error } = await supabase
      .from('attendances')
      .upsert({
        schedule_id: scheduleId,
        member_id: currentMember.id,
        status,
        updated_at: new Date().toISOString()
      }, { onConflict: 'schedule_id, member_id' })

    if (error) {
      alert('ステータスの更新に失敗しました')
      // Revert simplistic...
    }
  }

  if (error) return <div className="p-4 text-red-500">エラー: {error}</div>
  if (loading) return <div className="p-4 text-center">読み込み中...</div>

  // Not logged in to LINE (Web browser case)
  if (!isLoggedIn) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-bold mb-4">楽団スケジュール管理</h1>
        <p className="mb-4">LINEアプリで開いてください。</p>
        <button
          onClick={() => liff?.login()}
          className="bg-[#06C755] text-white px-6 py-2 rounded-lg font-bold"
        >
          LINEログイン
        </button>
      </div>
    )
  }

  // Logged in but not linked
  if (!currentMember) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">ようこそ！</h1>
        <p className="mb-4 text-sm text-gray-600">初回設定です。リストから自分の名前を選択してください。</p>

        {unlinkedMembers.length === 0 ? (
          <p className="text-red-500">選択可能なメンバーが見つかりません。管理者に問い合わせてください。</p>
        ) : (
          <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow">
            {unlinkedMembers.map(member => (
              <li key={member.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold">{member.name}</p>
                  <p className="text-xs text-gray-500">{member.part}</p>
                </div>
                <button
                  onClick={() => handleLinkUser(member.id)}
                  className="bg-indigo-600 text-white text-xs px-3 py-1 rounded"
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

  // Main Dashboard
  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <header className="bg-white shadow p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-lg">マイスケジュール</h1>
          <div className="text-xs text-right">
            <p>{currentMember.name}</p>
            <p className="text-gray-500">{currentMember.part}</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {schedules.length === 0 && <p className="text-center text-gray-500 mt-10">予定はありません。</p>}

        {schedules.map(schedule => {
          const myStatus = myAttendances[schedule.id]?.status || null

          return (
            <div key={schedule.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg">{schedule.date}</h2>
                    <p className="text-sm text-gray-600">{schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">{schedule.place}</span>
                </div>
                <p className="mt-2 text-indigo-600 font-medium">{schedule.content}</p>
                {schedule.note && <p className="mt-1 text-xs text-gray-500">{schedule.note}</p>}
              </div>

              {/* Action Area */}
              <div className="p-3 bg-gray-50 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAttendanceChange(schedule.id, 'attendance')}
                  className={`py-2 px-1 text-sm font-medium rounded ${myStatus === 'attendance' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                  出席
                </button>
                <button
                  onClick={() => handleAttendanceChange(schedule.id, 'absence')}
                  className={`py-2 px-1 text-sm font-medium rounded ${myStatus === 'absence' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
                >
                  欠席
                </button>
              </div>
              {/* Additional options could be toggleable */}
            </div>
          )
        })}
      </main>
    </div>
  )
}
