'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBudgetText } from '@/lib/budget/formatter';
import { formatCurrency, formatDisplayQuantity, getCategoryLabel } from '@/lib/budget/presentation';
import type { BudgetCategory, BudgetResultJson, PricingResult } from '@/types/budget';

interface BudgetResultProps {
  category: BudgetCategory;
  result: BudgetResultJson;
  pricing: PricingResult;
  onClear: () => void;
}

type TechnicalSectionKey = 'diagnostico' | 'escopo' | 'cronograma' | 'observacoes';

const orderedSections: Array<{ key: TechnicalSectionKey; label: string }> = [
  { key: 'diagnostico', label: 'Diagnóstico' },
  { key: 'escopo', label: 'Escopo técnico' },
  { key: 'cronograma', label: 'Cronograma' },
  { key: 'observacoes', label: 'Observações' },
];

export const BudgetResult = ({ category, result, pricing, onClear }: BudgetResultProps) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const categoryLabel = useMemo(() => getCategoryLabel(category), [category]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatBudgetText(category, result, pricing));
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError('Não foi possível copiar automaticamente. Tente novamente.');
    }
  };

  return (
    <Card className="overflow-hidden border-blue-100 p-0 shadow-sm">
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Pré-orçamento técnico preliminar</h2>
            <p className="mt-1 text-sm text-gray-600">Composição técnica e financeira estimada para validação inicial.</p>
          </div>

          <span className="w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-bold tracking-wide text-white">
            {categoryLabel}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={handleCopy} variant="secondary" className="w-auto" leftIcon={<span>📋</span>}>
            Copiar orçamento
          </Button>

          <Button onClick={onClear} variant="outline" className="w-auto">
            Limpar resultado
          </Button>

          {copied && <span className="text-sm font-medium text-green-600">Copiado com sucesso.</span>}
        </div>

        {copyError && <p className="text-sm text-red-600">{copyError}</p>}

        {result.executive && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Visão executiva</h3>
            <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
              <p><strong>Serviço:</strong> {result.executive.service}</p>
              <p><strong>Área:</strong> {result.executive.area} m²</p>
              <p className="sm:col-span-2"><strong>Objetivo:</strong> {result.executive.objective}</p>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-700">Resumo financeiro</h3>
          <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
            <p><strong>Materiais:</strong> {formatCurrency(pricing.materialSubtotal)}</p>
            <p><strong>Mão de obra:</strong> {formatCurrency(pricing.laborSubtotal)}</p>
            <p className="font-bold text-emerald-800"><strong>Total estimado:</strong> {formatCurrency(pricing.totalCost)}</p>
          </div>
          <p className="mt-2 text-xs text-emerald-800/80">Valor preliminar sujeito à vistoria técnica.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Materiais estimados</h3>
            <div className="space-y-2 text-sm">
              {pricing.materials.map((item) => (
                <div key={item.code} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600">
                    {formatDisplayQuantity(item.quantity, item.unit)} × {formatCurrency(item.unitCost)} = {formatCurrency(item.totalCost)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Mão de obra estimada</h3>
            <div className="space-y-2 text-sm">
              {pricing.labor.map((item) => (
                <div key={item.code} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600">
                    {formatDisplayQuantity(item.quantity, item.unit)} × {formatCurrency(item.unitCost)} = {formatCurrency(item.totalCost)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {orderedSections.map(({ key, label }) => {
            const items = result[key] ?? [];

            return (
              <div key={key} className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{label}</h3>
                <ul className="space-y-2 text-sm leading-relaxed text-gray-700">
                  {items.map((item: string, index: number) => (
                    <li key={`${key}-${index}`} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
