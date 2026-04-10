import { baseLaborCosts, baseMaterialCosts, baseMobilizationCosts } from '@/data/pricing/base-costs';
import { categoryCompositions, complexityFactor } from '@/data/pricing/compositions';
import type { AccessType, BudgetCategory, BudgetComplexity, LaborItem, MaterialItem, PricingResult, TechnicalBudgetCategory } from '@/types/budget';
import { daysFromProductivity, round2, safeNumber } from './helpers';

interface CalculateBudgetInput {
  category: BudgetCategory;
  area: number;
  complexity: BudgetComplexity;
  accessType?: AccessType;
}

const technicalCategorySet = new Set<TechnicalBudgetCategory>([
  'pintura_interna',
  'pintura_externa',
  'percussao_simples',
  'percussao_irata',
  'fachada_ceramica',
  'fachada_textura',
]);

const toTechnicalCategory = (category: BudgetCategory): TechnicalBudgetCategory | null =>
  technicalCategorySet.has(category as TechnicalBudgetCategory)
    ? (category as TechnicalBudgetCategory)
    : null;

const defaultPricingResult = (category: BudgetCategory): PricingResult => ({
  category,
  materials: [],
  labor: [],
  materialSubtotal: 0,
  laborSubtotal: 0,
  mobilizationCost: 0,
  additionalCost: 0,
  totalCost: 0,
  notes: ['Categoria sem composição específica de custos. Resultado parcial seguro aplicado.'],
});

export const calculateBudget = ({
  category,
  area,
  complexity,
  accessType,
}: CalculateBudgetInput): PricingResult => {
  const technicalCategory = toTechnicalCategory(category);
  const safeArea = safeNumber(area, 0.1);

  if (!technicalCategory) {
    return defaultPricingResult(category);
  }

  const composition = categoryCompositions[technicalCategory];
  const complexityMultiplier = complexityFactor[complexity];
  const materialItems: MaterialItem[] = composition.materials.map((item) => {
    const costRef = baseMaterialCosts[item.code as keyof typeof baseMaterialCosts];
    const quantity = round2(safeArea * item.consumptionPerM2 * complexityMultiplier);
    const totalCost = round2(quantity * costRef.unitCost);

    return {
      code: item.code,
      name: costRef.name,
      unit: costRef.unit,
      quantity,
      unitCost: costRef.unitCost,
      totalCost,
    };
  });

  const laborItems: LaborItem[] = composition.labor.map((item) => {
    const costRef = baseLaborCosts[item.code as keyof typeof baseLaborCosts];
    const days = item.fixedDays ?? daysFromProductivity(safeArea * complexityMultiplier, item.productivityM2PerDay);
    const quantity = round2(days);
    const totalCost = round2(quantity * costRef.unitCost);

    return {
      code: item.code,
      name: costRef.name,
      unit: costRef.unit,
      quantity,
      unitCost: costRef.unitCost,
      totalCost,
    };
  });

  const materialSubtotal = round2(materialItems.reduce((sum, item) => sum + item.totalCost, 0));
  const laborSubtotal = round2(laborItems.reduce((sum, item) => sum + item.totalCost, 0));

  const mobilizationKey = accessType ?? composition.defaultMobilization;
  const mobilizationCost = mobilizationKey ? round2(baseMobilizationCosts[mobilizationKey] * complexityMultiplier) : 0;

  const additionalByAccess = composition.accessAdditionalByM2
    ? round2(safeArea * composition.accessAdditionalByM2 * complexityMultiplier)
    : 0;

  const preTotal = round2(materialSubtotal + laborSubtotal + mobilizationCost + additionalByAccess);

  const totalCost = composition.minCost ? Math.max(preTotal, composition.minCost) : preTotal;
  const additionalCost = round2(totalCost - materialSubtotal - laborSubtotal - mobilizationCost);

  return {
    category,
    materials: materialItems,
    labor: laborItems,
    materialSubtotal,
    laborSubtotal,
    mobilizationCost,
    additionalCost,
    totalCost: round2(totalCost),
    notes: [
      ...composition.notes,
      `Fator de complexidade aplicado: ${complexity} (${complexityMultiplier}).`,
      composition.minCost ? `Custo mínimo operacional considerado: R$ ${composition.minCost.toFixed(2)}.` : 'Sem custo mínimo obrigatório para esta categoria.',
    ],
  };
};
