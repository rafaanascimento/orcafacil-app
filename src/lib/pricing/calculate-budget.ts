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
  'impermeabilizacao_reservatorio',
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
  complexityCost: 0,
  accessCost: 0,
  contingencyCost: 0,
  minimumAdjustment: 0,
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
    const quantity = round2(safeArea * item.consumptionPerM2);
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
    const days = item.fixedDays ?? daysFromProductivity(safeArea, item.productivityM2PerDay);
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
  const mobilizationCost = mobilizationKey ? round2(baseMobilizationCosts[mobilizationKey]) : 0;

  const complexityCost = round2((materialSubtotal + laborSubtotal) * (complexityMultiplier - 1));
  const accessCost = composition.accessAdditionalByM2 ? round2(safeArea * composition.accessAdditionalByM2) : 0;
  const contingencyCost = round2((materialSubtotal + laborSubtotal) * 0.03);

  const baseTotal = round2(
    materialSubtotal + laborSubtotal + mobilizationCost + complexityCost + accessCost + contingencyCost,
  );

  const minimumAdjustment = composition.minCost ? round2(Math.max(composition.minCost - baseTotal, 0)) : 0;
  const additionalCost = round2(complexityCost + accessCost + contingencyCost + minimumAdjustment);
  const totalCost = round2(materialSubtotal + laborSubtotal + mobilizationCost + additionalCost);

  return {
    category,
    materials: materialItems,
    labor: laborItems,
    materialSubtotal,
    laborSubtotal,
    mobilizationCost,
    complexityCost,
    accessCost,
    contingencyCost,
    minimumAdjustment,
    additionalCost,
    totalCost,
    notes: [
      ...composition.notes,
      `Fator de complexidade aplicado: ${complexity} (${complexityMultiplier}).`,
      `Adicionais detalhados — Complexidade: R$ ${complexityCost.toFixed(2)}, Acesso: R$ ${accessCost.toFixed(2)}, Contingência: R$ ${contingencyCost.toFixed(2)}, Ajuste de mínimo: R$ ${minimumAdjustment.toFixed(2)}.`,
      composition.minCost
        ? `Custo mínimo operacional de referência: R$ ${composition.minCost.toFixed(2)}.`
        : 'Sem custo mínimo obrigatório para esta categoria.',
    ],
  };
};
