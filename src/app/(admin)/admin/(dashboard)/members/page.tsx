import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import BackButton from '@/components/admin/BackButton'

export default async function MembersPage() {
    const supabase = await createClient()

    const { data: members } = await supabase
        .from('members')
        .select('*')
        .order('part', { ascending: true })
        .order('name', { ascending: true })

    // Defined order
    const ORDERED_PARTS = [
        'フルート', 'オーボエ', 'ファゴット', 'クラリネット', 'サックス',
        'トランペット', 'ホルン', 'トロンボーン', 'ユーフォニアム', 'チューバ',
        'コントラバス', 'パーカッション', '新入隊員'
    ]

    // Group by part
    const membersByPart: Record<string, NonNullable<typeof members>> = {}
    members?.forEach((member) => {
        const part = member.part || '未定' // Handle missing part as '未定' or check if '新入隊員'
        if (!membersByPart[part]) {
            membersByPart[part] = []
        }
        membersByPart[part].push(member)
    })

    return (
        <div>
            <BackButton />
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
                {ORDERED_PARTS.map((part) => {
                    const partMembers = membersByPart[part] || []

                    // Skip empty sections
                    if (partMembers.length === 0) return null

                    return (
                        <div key={part} className="mb-8">
                            <h3 className="text-lg font-medium leading-6 text-gray-900 border-b border-gray-200 pb-2 mb-4">
                                {part} <span className="text-sm text-gray-500 font-normal ml-2">({partMembers.length}名)</span>
                            </h3>
                            <div className="bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                {/* Component List */}
                                <ul className="divide-y divide-gray-200">
                                    {partMembers.map((member) => (
                                        <li key={member.id} className="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
                                            <div className="flex min-w-0 gap-x-4 items-center flex-1">
                                                <Link href={`/admin/members/${member.id}/edit`} className="absolute inset-0" />
                                                <div className="min-w-0 flex-auto flex flex-wrap items-center gap-x-3 gap-y-1">
                                                    <p className="text-sm font-semibold leading-6 text-gray-900">
                                                        {member.name}
                                                    </p>
                                                    {member.role && (
                                                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                            {member.role}
                                                        </span>
                                                    )}
                                                    {member.is_on_leave && (
                                                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                            休隊中
                                                        </span>
                                                    )}

                                                    <div className="flex items-center gap-3 text-xs text-gray-500">
                                                        {member.birthday && (
                                                            <span>{calculateAge(member.birthday)}歳</span>
                                                        )}
                                                        {member.residence && (
                                                            <span className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-gray-600">
                                                                {member.residence}
                                                            </span>
                                                        )}
                                                        {member.note && (
                                                            <span className="truncate max-w-xs text-gray-400">
                                                                {member.note}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-x-4">
                                                <div className="hidden sm:flex sm:flex-col sm:items-end">
                                                    <p className="text-xs text-gray-500">LINE: {member.line_user_id ? '連携済' : '未連携'}</p>
                                                </div>
                                                <svg className="h-5 w-5 flex-none text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function calculateAge(birthday: string) {
    const birthDate = new Date(birthday)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return age
}
