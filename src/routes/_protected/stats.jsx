import { createFileRoute } from '@tanstack/react-router'
import { PageShell } from '@/components/layout/PageShell'

export const Route = createFileRoute('/_protected/stats')({
  component: StatsPage,
})

function StatsPage() {
  return (
    <PageShell>
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600 mb-6 shadow-sm">
          Platform Stats
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-3">Statistics</h1>
        <p className="text-stone-500 mb-8">View marketplace activity and trends.</p>

        <div className="rounded-xl border border-stone-200 bg-white p-8 text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="text-5xl mb-4">⚙️</div>
          <p className="text-stone-500 text-sm">This is another protected route placeholder.</p>
        </div>
      </div>
    </PageShell>
  )
}
