import type { BudgetCategory } from '@/types/budget';

const keywordMap: Record<Exclude<BudgetCategory, 'reforma-geral'>, string[]> = {
  fachada: ['fachada', 'infiltracao', 'infiltração', 'rachadura', 'trinca'],
  pintura: ['pintura', 'tinta', 'massa', 'lixar', 'demao', 'demão'],
  drywall: ['drywall', 'divisoria', 'divisória', 'gesso', 'forro'],
  hidraulica: ['hidraulica', 'hidráulica', 'vazamento', 'torneira', 'tubulacao', 'tubulação'],
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

export const classifyBudgetCategory = (description: string): BudgetCategory => {
  const text = normalize(description);

  let bestCategory: BudgetCategory = 'reforma-geral';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(keywordMap) as [BudgetCategory, string[]][]) {
    const score = keywords.reduce(
      (acc, keyword) => (text.includes(normalize(keyword)) ? acc + 1 : acc),
      0,
    );

    if (score > bestScore) {
      bestCategory = category;
      bestScore = score;
    }
  }

  return bestCategory;
};
