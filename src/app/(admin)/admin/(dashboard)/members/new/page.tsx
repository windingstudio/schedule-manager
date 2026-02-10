import { createMember } from '../actions'

const PARTS = [
    'フルート', 'オーボエ', 'クラリネット', 'ファゴット', 'サックス',
    'トランペット', 'ホルン', 'トロンボーン', 'ユーフォニアム', 'チューバ',
    'パーカッション', 'コントラバス'
]

export default function NewMemberPage() {
    return (
        <div className="max-w-lg mx-auto">
            <h1 className="text-2xl font-bold mb-6">団員の新規登録</h1>
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
