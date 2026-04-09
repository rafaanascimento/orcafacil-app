'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { generateBudget } from '@/lib/budget/generator';
import { createClient } from '@/lib/supabase/client';
import type { BudgetComplexity, GeneratedBudget } from '@/types/budget';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BudgetResult } from './budget-result';

const complexityOptions: { label: string; value: BudgetComplexity }[] = [
  { label: 'Baixa', value: 'baixa' },
  { label: 'Média', value: 'media' },
  { label: 'Alta', value: 'alta' },
];

export const BudgetForm = () => {
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [complexity, setComplexity] = useState<BudgetComplexity>('media');
  const [generated, setGenerated] = useState<GeneratedBudget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const parsedArea = useMemo(() => {
    const value = Number(area);
    return Number.isFinite(value) && value > 0 ? value : 0;
  }, [area]);

  const handleGenerate = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setFeedback(null);

    if (!description.trim()) {
      setError('Descreva o serviço antes de gerar o orçamento.');
      return;
    }

    setIsLoading(true);

    const budget = generateBudget({
      description,
      area: parsedArea,
      complexity,
    });

    setGenerated(budget);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError('Sua sessão expirou. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    const { error: saveError } = await supabase.from('budgets').insert({
      user_id: user.id,
      service_description: description,
      area: parsedArea,
      complexity,
      category: budget.category,
      result_json: budget.result,
    });

    if (saveError) {
      setError('Orçamento gerado, mas não foi possível salvar no histórico agora.');
    } else {
      setFeedback('Orçamento gerado e salvo com sucesso no histórico.');
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5 sm:p-6">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-ink">Descrição do serviço</label>
            <Textarea
              placeholder="Ex: Reparar infiltração e trincas na fachada frontal de um prédio comercial."
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Área aproximada (m²)</label>
              <Input
                type="number"
                min={0}
                step="0.1"
                placeholder="Ex: 85"
                value={area}
                onChange={(event) => setArea(event.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Complexidade</label>
              <select
                value={complexity}
                onChange={(event) => setComplexity(event.target.value as BudgetComplexity)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-ink focus:border-secondary focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {complexityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="sm:w-auto sm:px-8">
            {isLoading ? 'Gerando orçamento...' : 'Gerar Orçamento'}
          </Button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {feedback && <p className="mt-4 text-sm text-green-600">{feedback}</p>}
      </Card>

      {generated && <BudgetResult category={generated.category} result={generated.result} />}
    </div>
  );
};
