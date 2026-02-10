import { createClient } from '@/utils/supabase/server'

export default async function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // Fetch schedule details
    const { data: schedule } = await supabase
        .from('schedules')
        .select('*')
        .eq('id', id)
        .single()

    if (!schedule) {
        return <div>日程が見つかりません</div>
    }

    // Fetch all members to show everyone
    const { data: members } = await supabase
        .from('members')
        .select('*')
        .order('part', { ascending: true })
        .order('name', { ascending: true })

    // Fetch attendances for this schedule
    const { data: attendances } = await supabase
        .from('attendances')
        .select('*')
        .eq('schedule_id', id)

    // Map attendances by member_id
    const attendanceMap: Record<string, { status: string; comment: string }> = {}
    attendances?.forEach(a => {
        attendanceMap[a.member_id] = a
    })

    // Group by part
    const membersByPart: Record<string, NonNullable<typeof members>> = {}
    members?.forEach((member) => {
        if (!membersByPart[member.part]) {
            membersByPart[member.part] = []
        }
        membersByPart[member.part].push(member)
    })

    // Calculate statistics
    let attendingCount = 0
    let unknownCount = 0
    members?.forEach(m => {
        const status = attendanceMap[m.id]?.status
        if (status === 'attendance' || status === 'late' || status === 'leave_early') {
            attendingCount++
        } else if (!status) {
            unknownCount++
        }
    })


    return (
        <div>
            <div className="lg:flex lg:items-center lg:justify-between mb-6">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        {schedule.date} {schedule.content}
                    </h2>
                    <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            {/* Location Icon */}
                            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.45-.96 2.337-1.774C15.938 14.502 19 11.085 19 7a9 9 0 10-18 0c0 4.085 3.062 7.502 5.303 9.576.887.814 1.717 1.39 2.337 1.774.31.193.57.337.757.433.093.048.175.093.281.14l.018.008.006.003zM10 11a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
                            </svg>
                            {schedule.place}
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                            {/* Subtitle/Time */}
                            <svg className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                            </svg>
                            {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-4">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">出席人数</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{attendingCount}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">未回答</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{unknownCount}</dd>
                </div>
            </div>

            <div className="flow-root">
                {Object.keys(membersByPart).map((part) => (
                    <div key={part} className="mb-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-200 pb-2 mb-4">{part}</h3>
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead>
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">名前</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">回答</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">コメント</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {membersByPart[part]?.map(member => {
                                            const attendance = attendanceMap[member.id]
                                            const status = attendance?.status || 'unresponded'
                                            let statusColor = 'bg-gray-100 text-gray-800'
                                            let statusText = '未回答'

                                            if (status === 'attendance') {
                                                statusColor = 'bg-green-100 text-green-800'
                                                statusText = '出席'
                                            }
                                            if (status === 'absence') {
                                                statusColor = 'bg-red-100 text-red-800'
                                                statusText = '欠席'
                                            }
                                            if (status === 'late') {
                                                statusColor = 'bg-yellow-100 text-yellow-800'
                                                statusText = '遅刻'
                                            }
                                            if (status === 'leave_early') {
                                                statusColor = 'bg-blue-100 text-blue-800'
                                                statusText = '早退'
                                            }

                                            return (
                                                <tr key={member.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{member.name}</td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColor}`}>
                                                            {statusText}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{attendance?.comment}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
