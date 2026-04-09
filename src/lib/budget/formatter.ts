import type { BudgetCategory, BudgetResultJson } from '@/types/budget';

const categoryLabel: Record<BudgetCategory, string> = {
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

export const formatBudgetText = (category: BudgetCategory, result: BudgetResultJson) =>
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
  ].join('\n');
