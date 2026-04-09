import { Card } from '@/components/ui/card';
import type { BudgetCategory, BudgetResultJson } from '@/types/budget';

interface BudgetResultProps {
  category: BudgetCategory;
  result: BudgetResultJson;
}

const sectionLabels: Record<keyof BudgetResultJson, string> = {
  diagnostico: 'Diagnóstico',
  escopo: 'Escopo técnico',
  materiais: 'Materiais',
  mao_de_obra: 'Mão de obra',
  cronograma: 'Cronograma',
  observacoes: 'Observações',
};

export const BudgetResult = ({ category, result }: BudgetResultProps) => (
  <Card className="p-6">
    <div className="mb-5 flex items-center justify-between gap-3">
      <h2 className="text-lg font-semibold text-ink">Orçamento gerado</h2>
      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-primary">
        {category}
      </span>
    </div>

    <div className="space-y-4">
      {(Object.entries(result) as [keyof BudgetResultJson, string[]][]).map(([key, items]) => (
        <div key={key} className="rounded-xl border border-gray-100 p-4">
          <h3 className="mb-2 font-semibold text-ink">
            {sectionLabels[key]}
          </h3>
          <ul className="space-y-1 text-sm text-gray-700">
            {items.map((item, index) => (
              <li key={`${key}-${index}`} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Card>
);
