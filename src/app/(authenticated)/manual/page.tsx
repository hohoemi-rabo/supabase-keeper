import Link from 'next/link'

const keepaliveCode = `import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (!token || token !== process.env.KEEPALIVE_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
  })
}`

export default function ManualPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          &larr; Dashboard
        </Link>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-6">
        プロジェクト登録マニュアル
      </h2>

      {/* 概要 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">概要</h3>
        <p className="text-sm text-gray-700 mb-4">
          Supabase無料プランのプロジェクトは、7日間アクセスがないと自動的にpause（停止）されます。
          Supabase Keeperは毎日自動でpingを送信し、pauseを防止します。
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg font-medium">Step 1</span>
            <span>対象プロジェクトにエンドポイント追加</span>
          </div>
          <span className="hidden sm:inline text-gray-400">&rarr;</span>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg font-medium">Step 2</span>
            <span>Keeperに登録</span>
          </div>
          <span className="hidden sm:inline text-gray-400">&rarr;</span>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-lg font-medium">Step 3</span>
            <span>動作確認</span>
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-gray-900 text-white text-sm font-bold px-2.5 py-0.5 rounded-lg">Step 1</span>
          <h3 className="text-base font-semibold text-gray-900">
            監視対象プロジェクトに /api/keepalive を追加
          </h3>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          監視したいNext.jsプロジェクトに、以下のファイルを作成してください。
        </p>

        <div className="mb-3">
          <p className="text-xs font-medium text-gray-600 mb-1">
            src/app/api/keepalive/route.ts
          </p>
          <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-x-auto">
            <code>{keepaliveCode}</code>
          </pre>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
          <p className="text-sm font-medium text-amber-800 mb-2">環境変数の設定</p>
          <p className="text-sm text-amber-700">
            対象プロジェクトのVercel（またはホスティング先）に環境変数を追加してください:
          </p>
          <div className="mt-2 bg-white border border-amber-200 rounded px-3 py-2">
            <code className="text-sm font-mono text-gray-900">KEEPALIVE_TOKEN=任意のランダム文字列</code>
          </div>
          <p className="text-xs text-amber-600 mt-2">
            ※ このTokenは次のStep 2で使用します。安全な文字列を設定してください。
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-gray-900 text-white text-sm font-bold px-2.5 py-0.5 rounded-lg">Step 2</span>
          <h3 className="text-base font-semibold text-gray-900">
            Supabase Keeperにプロジェクトを登録
          </h3>
        </div>

        <ol className="space-y-4 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">1</span>
            <div>
              <p>ダッシュボードの<Link href="/projects/new" className="text-emerald-600 hover:underline font-medium">プロジェクトを追加</Link>をクリック</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">2</span>
            <div>
              <p className="mb-2">各項目を入力:</p>
              <div className="overflow-x-auto -mx-3 px-3">
                <table className="w-full border border-gray-200 rounded text-sm min-w-[480px]">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-gray-200 w-1/4">項目</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-gray-200 w-1/4">入力例</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-700 border-b border-gray-200">説明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium whitespace-nowrap">Name</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-mono text-xs">My App</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-gray-600">プロジェクトの表示名</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 border-b border-gray-100 font-medium whitespace-nowrap">Keep-alive URL</td>
                      <td className="px-3 py-2 border-b border-gray-100 font-mono text-xs whitespace-nowrap">https://my-app.vercel.app/api/keepalive</td>
                      <td className="px-3 py-2 border-b border-gray-100 text-gray-600">Step 1で作成したエンドポイントのURL</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-medium whitespace-nowrap">Token</td>
                      <td className="px-3 py-2 font-mono text-xs">aBcDeFgH12345...</td>
                      <td className="px-3 py-2 text-gray-600">Step 1で設定した KEEPALIVE_TOKEN の値</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">3</span>
            <div>
              <p>「Save」ボタンで保存</p>
            </div>
          </li>
        </ol>
      </div>

      {/* Step 3 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-gray-900 text-white text-sm font-bold px-2.5 py-0.5 rounded-lg">Step 3</span>
          <h3 className="text-base font-semibold text-gray-900">
            動作確認
          </h3>
        </div>

        <ol className="space-y-3 text-sm text-gray-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">1</span>
            <p>ダッシュボードに戻り、登録したプロジェクトのカードを確認</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">2</span>
            <p>「Ping」ボタンをクリックして手動pingを実行</p>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-gray-100 border border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">3</span>
            <div>
              <p className="mb-1">ステータスが <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">OK</span> になれば成功</p>
              <p className="text-gray-500">以降は毎日AM 9:00 (JST) に自動でpingが送信されます</p>
            </div>
          </li>
        </ol>
      </div>

      {/* ステータスの見方 */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">ステータスの見方</h3>
        <div className="space-y-3 sm:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2">
            <span className="inline-flex w-fit px-1.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">OK</span>
            <span className="text-sm text-gray-700">正常に稼働中。直近のpingが成功しています。</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2">
            <span className="inline-flex w-fit px-1.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">WARN</span>
            <span className="text-sm text-gray-700">連続2回以上失敗。URLやTokenを確認してください。</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2">
            <span className="inline-flex w-fit px-1.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-900 border border-red-300">DOWN</span>
            <span className="text-sm text-gray-700">連続5回以上失敗、または3日以上成功なし。対象プロジェクトの状態を確認してください。</span>
          </div>
        </div>
      </div>
    </div>
  )
}
