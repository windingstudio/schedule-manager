import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Check approval status
    const { data: profile } = await supabase
        .from('admin_profiles')
        .select('is_approved, role')
        .eq('id', user.id)
        .single()

    // If no profile exists, create one (first time login)
    if (!profile) {
        await supabase.from('admin_profiles').insert({
            id: user.id,
            email: user.email,
            is_approved: true, // Auto-approve everyone
            role: 'owner', // Default to owner for now to avoid permission issues
        })
    }

    // Approval check removed as per user request
    // if (!profile.is_approved) { ... }

    return (
    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-slate-900 shadow-lg relative z-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/admin" className="font-bold text-xl text-white tracking-wide">
                                    Orchestra Admin
                                </Link>
                            </div>
                            <div className="hidden sm:-my-px sm:ml-10 sm:flex sm:space-x-8">
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-400 text-sm font-medium text-white"
                                >
                                    ダッシュボード
                                </Link>
                                <Link
                                    href="/admin/schedules"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-gray-400 transition-colors duration-200"
                                >
                                    スケジュール
                                </Link>
                                <Link
                                    href="/admin/members"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-300 hover:text-white hover:border-gray-400 transition-colors duration-200"
                                >
                                    名簿管理
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400 font-light">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button className="text-xs border border-gray-600 rounded px-3 py-1.5 text-gray-300 hover:text-white hover:border-white transition-all duration-200">
                                    ログアウト
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="py-10">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
