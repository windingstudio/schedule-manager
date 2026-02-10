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
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex flex-shrink-0 items-center">
                                <Link href="/admin" className="font-bold text-xl text-gray-800">
                                    OrchManager Admin
                                </Link>
                            </div>
                            <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    href="/admin"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-indigo-500 text-sm font-medium text-gray-900"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/schedules"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    Schedules
                                </Link>
                                <Link
                                    href="/admin/members"
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                >
                                    Members
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-sm text-gray-500 mr-4">{user.email}</span>
                            <form action="/auth/signout" method="post">
                                <button className="text-sm text-red-600 hover:text-red-800">
                                    Logout
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
