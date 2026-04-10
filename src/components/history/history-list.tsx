'use client';

import { useMemo, useState } from 'react';
import { getCategoryLabel, formatCurrency } from '@/lib/budget/presentation';
import { createClient } from '@/lib/supabase/client';
import type { BudgetRecord, PricingResult } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface HistoryListProps {
  initialBudgets: BudgetRecord[];
}

const sectionLabels: Record<'diagnostico' | 'escopo' | 'cronograma' | 'observacoes', string> = {
  diagnostico: 'Diagnóstico',
  escopo: 'Escopo técnico',
  cronograma: 'Cronograma',
  observacoes: 'Observações',
};

const complexityLabels: Record<BudgetRecord['complexity'], string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const HistoryList = ({ initialBudgets }: HistoryListProps) => {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const empty = useMemo(() => budgets.length === 0, [budgets]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Deseja realmente excluir este orçamento do histórico?');
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);
    setFeedback(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Sua sessão expirou. Faça login novamente.');
      setDeletingId(null);
      return;
    }

    const { error: deleteError } = await supabase.from('budgets').delete().eq('id', id).eq('user_id', user.id);

    if (deleteError) {
      setError('Não foi possível excluir o orçamento agora.');
      setDeletingId(null);
      return;
    }

    setBudgets((prev) => prev.filter((item) => item.id !== id));
    setExpandedId((prev) => (prev === id ? null : prev));
    setFeedback('Orçamento removido do histórico com sucesso.');
    setDeletingId(null);
  };

  if (empty) {
    return (
      <Card className="border-dashed border-blue-200 bg-gradient-to-br from-white to-blue-50 p-6 text-center sm:p-8">
        <h2 className="text-lg font-semibold text-ink">Seu histórico ainda está vazio</h2>
        <p className="mt-2 text-sm text-gray-600">
          Gere seu primeiro orçamento na dashboard para começar a construir seu histórico técnico.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {feedback && <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{feedback}</p>}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {budgets.map((budget) => {
        const expanded = expandedId === budget.id;
        const pricing: PricingResult | null = budget.pricing_json ?? budget.result_json.pricing ?? null;
        const displayCategory = pricing?.category ?? budget.category;

        return (
          <Card
            key={budget.id}
            className="group border-blue-50 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-5"
          >
            <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold sm:gap-2 sm:text-xs">
                  <span className="rounded-full bg-primary px-2.5 py-1 text-white sm:px-3">
                    {getCategoryLabel(displayCategory)}
                  </span>

                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-primary sm:px-3">
                    Complexidade: {complexityLabels[budget.complexity]}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700 sm:px-3">Área: {budget.area} m²</span>

                  {(pricing || typeof budget.total_cost === 'number') && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700 sm:px-3">
                      Total estimado: {formatCurrency(pricing?.totalCost ?? budget.total_cost ?? 0)}
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-gray-500 sm:text-sm">
                  {new Date(budget.created_at).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short',
                  })}
                </p>

                <p className="text-sm leading-relaxed text-gray-700 sm:pr-6">{budget.service_description}</p>
              </div>

              <div className="flex items-center gap-2 self-start">
                <Button
                  type="button"
                  variant="outline"
                  className="w-auto whitespace-nowrap px-3 py-2 text-xs sm:text-sm"
                  onClick={() => setExpandedId(expanded ? null : budget.id)}
                >
                  {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-auto border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600 hover:bg-red-100 sm:text-sm"
                  isLoading={deletingId === budget.id}
                  onClick={() => handleDelete(budget.id)}
                >
                  Excluir
                </Button>
              </div>
            </div>

            {expanded && (
              <div className="mt-3.5 space-y-3 border-t border-gray-100 pt-3.5 sm:mt-4 sm:pt-4">
                {pricing && (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-emerald-700">Resumo financeiro</h3>
                    <div className="grid gap-1 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
                      <p>Materiais: {formatCurrency(pricing.materialSubtotal ?? 0)}</p>
                      <p>Mão de obra: {formatCurrency(pricing.laborSubtotal ?? 0)}</p>
                      <p>Mobilização: {formatCurrency(pricing.mobilizationCost ?? 0)}</p>
                      <p>Complexidade: {formatCurrency(pricing.complexityCost ?? 0)}</p>
                      <p>Adicionais: {formatCurrency(pricing.additionalCost ?? 0)}</p>
                      <p className="font-semibold text-emerald-700">Total: {formatCurrency(pricing.totalCost ?? 0)}</p>
                    </div>
                  </div>
                )}

                {pricing && (
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Materiais estimados</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {(pricing.materials ?? []).map((item) => (
                          <li key={item.code}>
                            {item.name} — {item.quantity} {item.unit} ({formatCurrency(item.totalCost)})
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">Mão de obra estimada</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {(pricing.labor ?? []).map((item) => (
                          <li key={item.code}>
                            {item.name} — {item.quantity} {item.unit} ({formatCurrency(item.totalCost)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="grid gap-2.5 sm:gap-3 md:grid-cols-2">
                  {(Object.entries(sectionLabels) as [keyof typeof sectionLabels, string][]).map(([section, label]) => {
                    const entries = budget.result_json[section] ?? [];

                    return (
                      <div key={section} className="rounded-xl bg-gray-50 p-2.5 sm:p-3">
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">{label}</h3>
                        <ul className="space-y-1 text-sm text-gray-700">
                          {entries.map((item: string, idx: number) => (
                            <li key={`${section}-${idx}`} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
