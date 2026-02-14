import { createClient } from '@/infrastructure/supabase/server'
import Link from 'next/link'
import BackButton from '@/components/admin/BackButton'
import { SupabaseScheduleRepository } from '@/infrastructure/repositories/SupabaseScheduleRepository'
import { GetSchedules } from '@/use_cases/schedule/GetSchedules'

export default async function SchedulesPage() {
    const supabase = await createClient()
    const repository = new SupabaseScheduleRepository(supabase)
    const getSchedules = new GetSchedules(repository)

    const { upcoming, finished } = await getSchedules.execute()

    return (
        <div>
            <BackButton />
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">練習日程一覧</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        今後の練習日程と終了した日程の一覧です。
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/admin/schedules/new"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        日程を追加
                    </Link>
                </div>
            </div>

            <div className="mt-8 space-y-12">
                {/* Upcoming */}
                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-indigo-500 pl-3">今後の予定</h2>
                    <ScheduleList schedules={upcoming} emptyMessage="今後の予定はありません。" />
                </section>

                {/* Finished */}
                <section>
                    <h2 className="text-lg font-bold text-gray-500 mb-4 border-l-4 border-gray-300 pl-3">終了した予定</h2>
                    <ScheduleList schedules={finished} emptyMessage="終了した予定はありません。" isFinished />
                </section>
            </div>
        </div>
    )
}

function ScheduleList({ schedules, emptyMessage, isFinished }: { schedules: any[], emptyMessage: string, isFinished?: boolean }) {
    if (!schedules || schedules.length === 0) {
        return <p className="text-sm text-gray-500 italic">{emptyMessage}</p>
    }

    return (
        <div className="flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <ul className={`divide-y divide-gray-200 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg ${isFinished ? 'opacity-75' : ''}`}>
                        {schedules.map((schedule) => (
                            <li key={schedule.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">
                                            <Link href={`/admin/schedules/${schedule.id}`}>
                                                <span className="absolute inset-x-0 -top-px bottom-0" />
                                                {schedule.date} ({schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)})
                                            </Link>
                                        </p>
                                        <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                            {schedule.content} @ {schedule.place}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center gap-x-4">
                                    <svg className="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

