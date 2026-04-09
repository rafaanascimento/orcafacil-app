import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Card } from '@/components/ui/card';
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
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Histórico de orçamentos</h1>
          <p className="text-sm text-gray-500">Consulte os orçamentos gerados anteriormente.</p>
        </div>
        <Link href="/dashboard" className="text-sm font-semibold text-primary hover:text-blue-700">
          ← Voltar para dashboard
        </Link>
      </header>

      {error ? (
        <Card className="p-6 text-sm text-red-600">
          Não foi possível carregar o histórico neste momento.
        </Card>
      ) : budgets.length === 0 ? (
        <Card className="p-6 text-sm text-gray-600">
          Você ainda não possui orçamentos salvos. Gere seu primeiro orçamento na dashboard.
        </Card>
      ) : (
        <section className="space-y-4">
          {budgets.map((budget) => (
            <Card key={budget.id} className="p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
                <span className="rounded-full bg-blue-50 px-2 py-1 uppercase text-primary">
                  {budget.category}
                </span>
                <span>Complexidade: {budget.complexity}</span>
                <span>Área: {budget.area} m²</span>
                <span>
                  Criado em:{' '}
                  {new Date(budget.created_at).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700">{budget.service_description}</p>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}
