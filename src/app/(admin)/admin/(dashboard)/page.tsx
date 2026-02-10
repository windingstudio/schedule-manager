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
    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900">
                    ダッシュボード
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    現在の団の状況と直近の予定を確認できます。
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg">
                                {/* Icon */}
                                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">
                                        次回の練習
                                    </dt>
                                    <dd>
                                        <div className="text-lg font-bold text-gray-900 mt-1">
                                            {schedules && schedules[0] ? (
                                                <>
                                                    {new Date(schedules[0].date).toLocaleDateString()}<br />
                                                    <span className="text-sm font-normal text-gray-500 mt-1 block">
                                                        {schedules[0].start_time.slice(0, 5)} - {schedules[0].end_time.slice(0, 5)}
                                                    </span>
                                                </>
                                            ) : (
                                                "予定なし"
                                            )}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                        <div className="text-sm">
                            <Link href="/admin/schedules" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                すべての予定を見る &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-shadow duration-300">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-pink-50 p-3 rounded-lg">
                                {/* Icon */}
                                <svg className="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">
                                        登録隊員数
                                    </dt>
                                    <dd>
                                        <div className="text-2xl font-bold text-gray-900 mt-1">
                                            {/* Placeholder for member count */}
                                            0 <span className="text-sm font-normal text-gray-500">名</span>
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                        <div className="text-sm">
                            <Link href="/admin/members" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                                名簿管理へ &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    クイックアクション
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Link
                        href="/admin/schedules/new"
                        className="group relative flex items-center space-x-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:border-indigo-300 hover:shadow-md hover:ring-1 hover:ring-indigo-300 transition-all duration-200"
                    >
                        <div className="flex-shrink-0">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-base font-medium text-gray-900 group-hover:text-indigo-700">予定を追加</p>
                            <p className="truncate text-sm text-gray-500">新しい練習日程を作成します</p>
                        </div>
                    </Link>

                    <Link
                        href="/admin/members/new"
                        className="group relative flex items-center space-x-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:border-pink-300 hover:shadow-md hover:ring-1 hover:ring-pink-300 transition-all duration-200"
                    >
                        <div className="flex-shrink-0">
                            <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-200">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="absolute inset-0" aria-hidden="true" />
                            <p className="text-base font-medium text-gray-900 group-hover:text-pink-700">隊員登録</p>
                            <p className="truncate text-sm text-gray-500">新しい隊員を追加します</p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
