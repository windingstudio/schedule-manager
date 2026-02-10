import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function MembersPage() {
    const supabase = await createClient()

    const { data: members } = await supabase
        .from('members')
        .select('*')
        .order('part', { ascending: true })
        .order('name', { ascending: true })

    // Group by part
    const membersByPart: Record<string, NonNullable<typeof members>> = {}
    members?.forEach((member) => {
        if (!membersByPart[member.part]) {
            membersByPart[member.part] = []
        }
        membersByPart[member.part].push(member)
    })

    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">団員名簿</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        現在登録されている団員の一覧です。
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href="/admin/members/new"
                        className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        団員を追加
                    </Link>
                </div>
            </div>

            <div className="mt-8 flow-root">
                {Object.keys(membersByPart).map((part) => (
                    <div key={part} className="mb-8">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-200 pb-2 mb-4">{part}</h3>
                        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <ul className="divide-y divide-gray-200 bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                    {membersByPart[part]?.map((member) => (
                                        <li key={member.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                            <div className="flex min-w-0 gap-x-4">
                                                <div className="min-w-0 flex-auto">
                                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                                        {member.name}
                                                    </p>
                                                    <p className="mt-1 flex text-xs leading-5 text-gray-500">
                                                        LINE連携: {member.line_user_id ? '済み' : '未連携'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-x-4">
                                                {/* Delete button would go here in a form */}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
                {(!members || members.length === 0) && (
                    <p className="text-center text-gray-500 mt-10">団員が登録されていません。「団員を追加」ボタンから登録してください。</p>
                )}
            </div>
        </div>
    )
}
