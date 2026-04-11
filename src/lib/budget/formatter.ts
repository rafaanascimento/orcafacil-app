import { formatCurrency, getCategoryLabel } from '@/lib/budget/presentation';
import type { BudgetCategory, BudgetResultJson, PricingResult } from '@/types/budget';

const formatSection = (title: string, entries: string[]) => {
  const lines = entries.map((item) => `- ${item}`).join('\n');
  return `${title}:\n${lines}`;
};

const formatFinancialSummary = (pricing: PricingResult) =>
  [
    'Resumo financeiro:',
    `- Materiais: ${formatCurrency(pricing.materialSubtotal)}`,
    `- Mão de obra: ${formatCurrency(pricing.laborSubtotal)}`,
    `- Mobilização: ${formatCurrency(pricing.mobilizationCost)}`,
    `- Adicionais (complexidade/acesso/contingência): ${formatCurrency(pricing.additionalCost)}`,
    `- Total estimado: ${formatCurrency(pricing.totalCost)}`,
  ].join('\n');

export const formatBudgetText = (category: BudgetCategory, result: BudgetResultJson, pricing?: PricingResult) =>
  [
    'Orçamento técnico gerado',
    `Categoria: ${getCategoryLabel(category)}`,
    '',
    formatSection('Diagnóstico', result.diagnostico),
    '',
    formatSection('Escopo técnico', result.escopo),
    '',
    formatSection('Materiais', result.materiais),
    '',
    formatSection('Mão de obra', result.mao_de_obra),
    '',
    formatSection('Cronograma', result.cronograma),
    '',
    formatSection('Observações', result.observacoes),
    ...(pricing ? ['', formatFinancialSummary(pricing)] : []),
  ].join('\n');
