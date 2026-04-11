'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { generateBudget } from '@/lib/budget/generator';
import { getStorageCategory } from '@/lib/budget/presentation';
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

const hasMissingColumnError = (message: string | undefined) => {
  const text = (message ?? '').toLowerCase();
  return text.includes('column') && text.includes('does not exist');
};

export const BudgetForm = () => {
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [complexity, setComplexity] = useState<BudgetComplexity>('media');
  const [generated, setGenerated] = useState<GeneratedBudget | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [areaTouched, setAreaTouched] = useState(false);

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

    if (parsedArea <= 0) {
      setAreaTouched(true);
      setError('Informe uma área válida em m² para gerar o orçamento.');
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

    const enrichedResult = {
      ...budget.result,
      pricing: budget.pricing,
    };

    const basePayload = {
      user_id: user.id,
      service_description: description,
      area: parsedArea,
      complexity,
      category: getStorageCategory(budget.category),
      result_json: enrichedResult,
    };

    const { error: saveError } = await supabase.from('budgets').insert({
      ...basePayload,
      pricing_json: budget.pricing,
      material_subtotal: budget.pricing.materialSubtotal,
      labor_subtotal: budget.pricing.laborSubtotal,
      mobilization_cost: budget.pricing.mobilizationCost,
      additional_cost: budget.pricing.additionalCost,
      total_cost: budget.pricing.totalCost,
    });

    if (saveError && hasMissingColumnError(saveError.message)) {
      const { error: legacySaveError } = await supabase.from('budgets').insert(basePayload);

      if (legacySaveError) {
        setError('Orçamento gerado, mas não foi possível salvar no histórico agora.');
      } else {
        setFeedback('Orçamento salvo no histórico. Campos financeiros completos aguardam migração do banco.');
      }

      setIsLoading(false);
      return;
    }

    if (saveError) {
      console.error('Erro ao salvar orçamento:', saveError);
      setError(`Orçamento gerado, mas não foi possível salvar. Detalhe: ${saveError.message}`);
    } else {
      setFeedback('Orçamento gerado e salvo com sucesso no histórico.');
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-3.5 sm:space-y-5">
      <Card className="border-blue-100/80 p-3.5 sm:p-6">
        <div className="mb-3.5 sm:mb-5">
          <h2 className="text-lg font-bold text-ink sm:text-xl">Gerador de orçamento técnico</h2>
          <p className="mt-1 text-sm text-gray-600">
            Preencha os campos abaixo para gerar uma proposta estruturada e pronta para envio.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3.5 sm:space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="block text-sm font-semibold text-ink">Descrição do serviço</label>
              <span className="text-[11px] text-gray-400">Obrigatório</span>
            </div>
            <p className="mb-1.5 text-xs text-gray-500">
              Descreva o serviço com o máximo de detalhes possível para gerar um orçamento técnico mais
              coerente.
            </p>
            <Textarea
              placeholder="Ex: Reparar infiltração e trincas na fachada frontal de um prédio comercial com preparação e pintura final."
              rows={4}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-24 resize-y"
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">Área aproximada (m²)</label>
              <Input
                type="number"
                min={0.1}
                step={0.1}
                inputMode="decimal"
                placeholder="Ex: 85"
                value={area}
                onBlur={() => setAreaTouched(true)}
                onChange={(event) => {
                  setArea(event.target.value);
                  if (!areaTouched) setAreaTouched(true);
                }}
                aria-invalid={areaTouched && parsedArea <= 0}
                required
                className={`[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                  areaTouched && parsedArea <= 0 ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''
                }`}
              />
              {areaTouched && parsedArea <= 0 && (
                <p className="mt-1 text-xs text-red-600">Área obrigatória. Informe um valor maior que zero.</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-ink">Complexidade</label>
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-blue-100 bg-blue-50/50 p-1">
                {complexityOptions.map((option) => {
                  const selected = complexity === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setComplexity(option.value)}
                      className={`rounded-lg px-2 py-1.5 text-center text-xs font-semibold transition sm:py-2 sm:text-sm ${
                        selected
                          ? 'bg-white text-primary shadow-[0_6px_18px_-16px_rgba(30,64,175,0.9)]'
                          : 'text-gray-600 hover:bg-white/70'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-gray-500/90">
                {complexityOptions.find((option) => option.value === complexity)?.helper}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            leftIcon={
              <span aria-hidden className="relative -top-px text-[15px] leading-none sm:text-base">
                ⚙️
              </span>
            }
            className="h-10 gap-2 text-[14px] shadow-[0_12px_24px_-16px_rgba(249,115,22,0.95)] sm:h-12 sm:w-auto sm:px-8 sm:text-base"
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
          pricing={generated.pricing}
          onClear={() => {
            setGenerated(null);
            setFeedback('Resultado limpo. Você pode gerar um novo orçamento.');
          }}
        />
      )}
    </div>
  );
};
