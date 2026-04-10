'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBudgetText } from '@/lib/budget/formatter';
import type { BudgetCategory, BudgetResultJson, PricingResult } from '@/types/budget';

interface BudgetResultProps {
  category: BudgetCategory;
  result: BudgetResultJson;
  pricing: PricingResult;
  onClear: () => void;
}

const sectionLabels: Record<keyof BudgetResultJson, string> = {
  diagnostico: 'Diagnóstico',
  escopo: 'Escopo técnico',
  materiais: 'Materiais',
  mao_de_obra: 'Mão de obra',
  cronograma: 'Cronograma',
  observacoes: 'Observações',
};

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const BudgetResult = ({ category, result, pricing, onClear }: BudgetResultProps) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Orçamento técnico gerado</h2>
            <p className="mt-1 text-sm text-gray-600">Estrutura montada com base nas informações fornecidas.</p>
          </div>

          <span className="w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            {category}
          </span>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
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

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-700">Resumo financeiro</h3>
          <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-5">
            <p><strong>Materiais:</strong> {money(pricing.materialSubtotal)}</p>
            <p><strong>Mão de obra:</strong> {money(pricing.laborSubtotal)}</p>
            <p><strong>Mobilização:</strong> {money(pricing.mobilizationCost)}</p>
            <p><strong>Adicionais:</strong> {money(pricing.additionalCost)}</p>
            <p className="font-bold text-emerald-800"><strong>Total:</strong> {money(pricing.totalCost)}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">Materiais estimados</h3>
            <div className="space-y-2 text-sm">
              {pricing.materials.map((item) => (
                <div key={item.code} className="rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-gray-600">{item.quantity} {item.unit} × {money(item.unitCost)} = {money(item.totalCost)}</p>
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
                  <p className="text-gray-600">{item.quantity} {item.unit} × {money(item.unitCost)} = {money(item.totalCost)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {(Object.entries(result) as [keyof BudgetResultJson, string[]][]).map(([key, items]) => (
            <div key={key} className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">{sectionLabels[key]}</h3>
              <ul className="space-y-2 text-sm leading-relaxed text-gray-700">
                {items.map((item: string, index: number) => (
                  <li key={`${key}-${index}`} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
