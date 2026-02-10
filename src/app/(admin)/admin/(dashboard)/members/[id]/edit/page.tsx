import { createClient } from '@/utils/supabase/server'
import { updateMember, deleteMember } from '../../actions'

const PARTS = [
    'フルート', 'オーボエ', 'ファゴット', 'クラリネット', 'サックス',
    'トランペット', 'ホルン', 'トロンボーン', 'ユーフォニアム', 'チューバ',
    'コントラバス', 'パーカッション', '新入隊員'
]

const ROLES = [
    'バンド長', '副バンド長', '組織主任', '音楽主任', 'パート長', '副パート長'
]

export default async function EditMemberPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single()

    if (!member) {
        return <div>Member not found</div>
    }

    const updateMemberWithId = updateMember.bind(null, id)

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">団員情報の編集</h1>
            <form action={updateMemberWithId} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">名前</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            defaultValue={member.name}
                            required
                            placeholder="氏名（フルネーム）"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="part" className="block text-sm font-medium leading-6 text-gray-900">パート</label>
                    <div className="mt-2">
                        <select
                            id="part"
                            name="part"
                            defaultValue={member.part}
                            required
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 px-3"
                        >
                            <option value="">パートを選択してください</option>
                            {PARTS.map(part => (
                                <option key={part} value={part}>{part}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium leading-6 text-gray-900">役職</label>
                        <div className="mt-2">
                            <select
                                id="role"
                                name="role"
                                defaultValue={member.role || ''}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            >
                                <option value="">なし</option>
                                {ROLES.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">年齢</label>
                        <div className="mt-2">
                            <input
                                type="number"
                                name="age"
                                id="age"
                                defaultValue={member.age || ''}
                                min="0"
                                max="100"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>
                </div>

                <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                        <input
                            id="is_on_leave"
                            name="is_on_leave"
                            type="checkbox"
                            defaultChecked={member.is_on_leave}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                    </div>
                    <div className="text-sm leading-6">
                        <label htmlFor="is_on_leave" className="font-medium text-gray-900">休隊中</label>
                        <p className="text-gray-500">休隊中の場合、連絡や出欠確認の対象から外れます。</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="note" className="block text-sm font-medium leading-6 text-gray-900">備考</label>
                    <div className="mt-2">
                        <textarea
                            id="note"
                            name="note"
                            rows={3}
                            defaultValue={member.note || ''}
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div className="flex justify-between gap-4">
                    <button
                        type="submit"
                        className="flex-1 justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        更新する
                    </button>
                    {/* Delete is a bit complex in a single form without JS toggle unless we use a separate form or button with formAction (if inside same form) */}
                    {/* For safety, let's keep delete separate or just a link/button that triggers it. 
                        Using a separate form for delete is standard pattern for server actions without JS 
                    */}
                </div>
            </form>

            <form action={deleteMember} className="mt-4">
                <input type="hidden" name="id" value={member.id} />
                <button
                    type="submit"
                    className="w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-red-600 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-50"
                >
                    この団員を削除する
                </button>
            </form>
        </div>
    )
}
