import type { BudgetCategory, TechnicalBudgetCategory } from '@/types/budget';

const keywordMap: Record<TechnicalBudgetCategory, string[]> = {
  pintura_interna: [
    'pintura interna',
    'parede interna',
    'ambiente interno',
    'massa corrida',
    'lixar parede',
    'pintar quarto',
    'pintar sala',
  ],
  pintura_externa: [
    'pintura externa',
    'fachada pintura',
    'area externa',
    'área externa',
    'muro externo',
    'tinta externa',
  ],
  percussao_simples: [
    'percussao',
    'percussão',
    'inspecao de fachada',
    'inspeção de fachada',
    'som cavo',
    'destacamento',
  ],
  percussao_irata: [
    'irata',
    'acesso por corda',
    'rapel',
    'alpinismo industrial',
    'cadeirinha',
  ],
  fachada_ceramica: [
    'fachada ceramica',
    'fachada cerâmica',
    'revestimento ceramico',
    'revestimento cerâmico',
    'pastilha',
    'assentamento',
    'rejunte',
  ],
  fachada_textura: [
    'fachada textura',
    'textura acrilica',
    'textura acrílica',
    'grafiato',
    'acabamento texturizado',
  ],
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

  for (const [category, keywords] of Object.entries(keywordMap) as [TechnicalBudgetCategory, string[]][]) {
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
