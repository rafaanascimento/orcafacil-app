import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { HistoryList } from '@/components/history/history-list';
import { createClient } from '@/lib/supabase/server';
import type { BudgetRecord } from '@/types/budget';

export default async function HistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data, error } = await supabase
    .from('budgets')
    .select('id, service_description, area, complexity, category, result_json, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const budgets = (data ?? []) as BudgetRecord[];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Histórico técnico</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">Orçamentos salvos</h1>
            <p className="mt-1 text-sm text-gray-500">Visualize, detalhe e gerencie os orçamentos gerados.</p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-blue-100"
          >
            <span aria-hidden>←</span>
            <span>Voltar para dashboard</span>
          </Link>
        </div>
      </header>

      {error ? (
        <Card className="p-6 text-sm text-red-600">Não foi possível carregar o histórico neste momento.</Card>
      ) : (
        <HistoryList initialBudgets={budgets} />
      )}
    </main>
  );
}
