import type { BudgetCategory, LegacyBudgetCategory } from '@/types/budget';

const categoryLabelMap: Record<BudgetCategory, string> = {
  pintura_interna: 'Pintura Interna',
  pintura_externa: 'Pintura Externa',
  percussao_simples: 'Teste de Percussão',
  percussao_irata: 'Teste de Percussão com IRATA',
  fachada_ceramica: 'Fachada com Cerâmica',
  fachada_textura: 'Fachada com Textura',
  fachada: 'Fachada',
  pintura: 'Pintura',
  drywall: 'Drywall',
  hidraulica: 'Hidráulica',
  'reforma-geral': 'Reforma Geral',
};

const storageCategoryMap: Record<BudgetCategory, LegacyBudgetCategory> = {
  pintura_interna: 'pintura',
  pintura_externa: 'pintura',
  percussao_simples: 'fachada',
  percussao_irata: 'fachada',
  fachada_ceramica: 'fachada',
  fachada_textura: 'fachada',
  fachada: 'fachada',
  pintura: 'pintura',
  drywall: 'drywall',
  hidraulica: 'hidraulica',
  'reforma-geral': 'reforma-geral',
};

export const getCategoryLabel = (category: BudgetCategory): string => categoryLabelMap[category] ?? 'Reforma Geral';

export const getStorageCategory = (category: BudgetCategory): LegacyBudgetCategory =>
  storageCategoryMap[category] ?? 'reforma-geral';

export const formatCurrency = (value: number): string =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const formatDisplayQuantity = (quantity: number, unit: string): string => {
  if (quantity <= 0) return `0 ${unit}`;

  if (quantity < 1) {
    const percent = Math.round(quantity * 100);
    if (unit === 'diária') return `alocação parcial (${percent}% da diária)`;
    if (unit === 'verba') return `verba proporcional (${percent}%)`;
    return `estimativa proporcional (${percent}% de ${unit})`;
  }

  const rounded = quantity >= 10 ? Math.round(quantity) : Math.round(quantity * 10) / 10;
  return `${rounded.toLocaleString('pt-BR')} ${unit}`;
};
