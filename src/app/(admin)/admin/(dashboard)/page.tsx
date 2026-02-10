import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch upcoming schedules
    const { data: schedules } = await supabase
        .from('schedules')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .limit(5)

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Quick Actions */}
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {/* Icon placeholder */}
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">New Schedule</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            <Link href="/admin/schedules/new" className="text-indigo-600 hover:text-indigo-500">Create</Link>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                {/* Icon placeholder */}
                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">Manage Members</dt>
                                    <dd>
                                        <div className="text-lg font-medium text-gray-900">
                                            <Link href="/admin/members" className="text-indigo-600 hover:text-indigo-500">View All</Link>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Upcoming Schedules</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-200">
                    {schedules && schedules.length > 0 ? (
                        schedules.map((schedule) => (
                            <li key={schedule.id}>
                                <Link href={`/admin/schedules/${schedule.id}`} className="block hover:bg-gray-50">
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate text-sm font-medium text-indigo-600">{schedule.content || 'Regular Practice'}</p>
                                            <div className="ml-2 flex flex-shrink-0">
                                                <p className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                                    {schedule.place}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {schedule.date} {schedule.start_time.slice(0, 5)} - {schedule.end_time.slice(0, 5)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">No upcoming schedules found.</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
