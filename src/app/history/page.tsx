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
    .select('id, service_description, area, complexity, category, result_json, pricing_json, material_subtotal, labor_subtotal, mobilization_cost, additional_cost, total_cost, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const budgets = (data ?? []) as BudgetRecord[];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl space-y-4 px-4 py-4 sm:space-y-6 sm:px-6 sm:py-6 lg:px-8">
      <header className="rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)] sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Histórico técnico</p>
            <h1 className="mt-1 text-xl font-bold text-ink sm:text-2xl">Orçamentos salvos</h1>
            <p className="mt-1 text-sm text-gray-500">Visualize, detalhe e gerencie os orçamentos gerados.</p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-blue-100 sm:rounded-xl sm:px-4 sm:py-2 sm:text-sm"
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
