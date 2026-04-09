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

const complexityOptions: { label: string; value: BudgetComplexity; helper: string }[] = [
  { label: 'Baixa', value: 'baixa', helper: 'Serviço objetivo com menor interferência operacional.' },
  { label: 'Média', value: 'media', helper: 'Exige coordenação técnica moderada.' },
  { label: 'Alta', value: 'alta', helper: 'Demanda gestão detalhada e execução faseada.' },
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
      <Card className="border-blue-100 p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-ink">Gerador de orçamento técnico</h2>
          <p className="mt-1 text-sm text-gray-600">
            Preencha os campos abaixo para gerar uma proposta estruturada e pronta para envio.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="block text-sm font-semibold text-ink">Descrição do serviço</label>
              <span className="text-xs text-gray-500">Campo obrigatório</span>
            </div>
            <p className="mb-2 text-xs text-gray-500">
              Descreva o serviço com o máximo de detalhes possível para gerar um orçamento técnico mais
              coerente.
            </p>
            <Textarea
              placeholder="Ex: Reparar infiltração e trincas na fachada frontal de um prédio comercial com preparação e pintura final."
              rows={6}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">Área aproximada (m²)</label>
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
              <label className="mb-2 block text-sm font-semibold text-ink">Complexidade</label>
              <div className="grid gap-2 sm:grid-cols-3">
                {complexityOptions.map((option) => {
                  const selected = complexity === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setComplexity(option.value)}
                      className={`rounded-xl border p-3 text-left transition ${
                        selected
                          ? 'border-primary bg-blue-50 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40'
                      }`}
                    >
                      <p className="text-sm font-semibold text-ink">{option.label}</p>
                      <p className="mt-1 text-xs text-gray-500">{option.helper}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={<span aria-hidden>⚙️</span>}
            className="h-12 text-base shadow-md sm:w-auto sm:px-8"
          >
            {isLoading ? 'Gerando orçamento...' : 'Gerar Orçamento'}
          </Button>
        </form>

        {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        {feedback && <p className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{feedback}</p>}
      </Card>

      {generated && (
        <BudgetResult
          category={generated.category}
          result={generated.result}
          onClear={() => {
            setGenerated(null);
            setFeedback('Resultado limpo. Você pode gerar um novo orçamento.');
          }}
        />
      )}
    </div>
  );
};
