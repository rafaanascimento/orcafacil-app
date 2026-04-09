'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatBudgetText } from '@/lib/budget/formatter';
import type { BudgetCategory, BudgetResultJson } from '@/types/budget';

interface BudgetResultProps {
  category: BudgetCategory;
  result: BudgetResultJson;
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

export const BudgetResult = ({ category, result, onClear }: BudgetResultProps) => {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatBudgetText(category, result));
      setCopied(true);
      setCopyError(null);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopyError('Não foi possível copiar automaticamente. Tente novamente.');
    }
  };

  return (
    <Card className="overflow-hidden border-blue-100 p-0 shadow-sm">
      {/* Header */}
      <div className="border-b border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-50 px-6 py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-ink">Orçamento técnico gerado</h2>
            <p className="mt-1 text-sm text-gray-600">
              Estrutura montada com base nas informações fornecidas.
            </p>
          </div>

          <span className="w-fit rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            {category}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleCopy}
            variant="secondary"
            className="w-auto"
            leftIcon={<span>📋</span>}
          >
            Copiar orçamento
          </Button>

          <Button onClick={onClear} variant="outline" className="w-auto">
            Limpar resultado
          </Button>

          {copied && (
            <span className="text-sm font-medium text-green-600">
              Copiado com sucesso.
            </span>
          )}
        </div>

        {copyError && <p className="text-sm text-red-600">{copyError}</p>}

        {/* Sections */}
        <div className="grid gap-4 lg:grid-cols-2">
          {(Object.entries(result) as [keyof BudgetResultJson, string[]][]).map(
            ([key, items]) => (
              <div
                key={key}
                className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm"
              >
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
                  {sectionLabels[key]}
                </h3>

                <ul className="space-y-2 text-sm leading-relaxed text-gray-700">
                  {items.map((item: string, index: number) => (
                    <li key={`${key}-${index}`} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
    </Card>
  );
};
