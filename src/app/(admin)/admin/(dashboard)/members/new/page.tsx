import { createMember } from '../actions'
import BackButton from '@/components/admin/BackButton'

const PARTS = [
    'フルート', 'オーボエ', 'ファゴット', 'クラリネット', 'サックス',
    'トランペット', 'ホルン', 'トロンボーン', 'ユーフォニアム', 'チューバ',
    'コントラバス', 'パーカッション', '新入隊員'
]

const ROLES = [
    'バンド長', '副バンド長', '組織主任', '音楽主任', 'パート長', '副パート長'
]

export default function NewMemberPage() {
    return (
        <div className="max-w-lg mx-auto">
            <BackButton href="/admin/members" />
            <h1 className="text-2xl font-bold mb-6 text-gray-900">隊員の新規登録</h1>
            <form action={createMember} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">名前</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="name"
                            id="name"
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
                        <label htmlFor="birthday" className="block text-sm font-medium leading-6 text-gray-900">生年月日</label>
                        <div className="mt-2">
                            <input
                                type="date"
                                name="birthday"
                                id="birthday"
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="residence" className="block text-sm font-medium leading-6 text-gray-900">居住地</label>
                    <div className="mt-2">
                        <input
                            type="text"
                            name="residence"
                            id="residence"
                            placeholder="例：中央区、明石市"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div className="relative flex gap-x-3">
                    <div className="flex h-6 items-center">
                        <input
                            id="is_on_leave"
                            name="is_on_leave"
                            type="checkbox"
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        登録する
                    </button>
                </div>
            </form>
        </div>
    )
}
