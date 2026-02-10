export default function ApprovalPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-bold text-gray-900">承認待ちです</h1>
            <p className="mt-4 text-gray-600">
                あなたのアカウントは現在、管理者による承認待ちの状態です。<br />
                承認されるまでしばらくお待ちください。
            </p>
            <form action="/auth/signout" method="post" className="mt-8">
                <button className="text-indigo-600 hover:text-indigo-500 underline">
                    ログアウトして戻る
                </button>
            </form>
        </div>
    )
}
