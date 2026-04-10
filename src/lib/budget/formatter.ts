import type { BudgetCategory, BudgetResultJson, PricingResult } from '@/types/budget';

const categoryLabel: Record<BudgetCategory, string> = {
  pintura_interna: 'Pintura interna',
  pintura_externa: 'Pintura externa',
  percussao_simples: 'Percussão simples',
  percussao_irata: 'Percussão IRATA',
  fachada_ceramica: 'Fachada cerâmica',
  fachada_textura: 'Fachada textura',
  fachada: 'Fachada',
  pintura: 'Pintura',
  drywall: 'Drywall',
  hidraulica: 'Hidráulica',
  'reforma-geral': 'Reforma geral',
};

const formatSection = (title: string, entries: string[]) => {
  const lines = entries.map((item) => `- ${item}`).join('\n');
  return `${title}:\n${lines}`;
};

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const formatFinancialSummary = (pricing: PricingResult) =>
  [
    'Resumo financeiro:',
    `- Materiais: ${money(pricing.materialSubtotal)}`,
    `- Mão de obra: ${money(pricing.laborSubtotal)}`,
    `- Mobilização: ${money(pricing.mobilizationCost)}`,
    `- Adicionais: ${money(pricing.additionalCost)}`,
    `- Total estimado: ${money(pricing.totalCost)}`,
  ].join('\n');

export const formatBudgetText = (category: BudgetCategory, result: BudgetResultJson, pricing?: PricingResult) =>
  [
    'Orçamento técnico gerado',
    `Categoria: ${categoryLabel[category]}`,
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
