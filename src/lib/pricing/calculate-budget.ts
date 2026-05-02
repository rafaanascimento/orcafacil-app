import { baseMobilizationCosts } from '@/data/pricing/base-costs';
import { categoryCompositions, complexityFactor } from '@/data/pricing/compositions';
import { laborDatabase, materialsDatabase } from '@/data/inputs/materials';
import type {
  AccessType,
  BudgetCategory,
  BudgetComplexity,
  LaborItem,
  MaterialItem,
  PricingResult,
  TechnicalBudgetCategory,
} from '@/types/budget';
import { round2, safeNumber } from './helpers';

interface CalculateBudgetInput {
  category: BudgetCategory;
  area: number;
  complexity: BudgetComplexity;
  accessType?: AccessType;
  propertyType?: 'residencial' | 'comercial';
  surfaceCondition?: 'novo' | 'regular' | 'degradado';
  access?: 'facil' | 'medio' | 'dificil';
  height?: number;
  finishStandard?: 'baixo' | 'medio' | 'alto';
}

const surfaceFactor = { novo: 1, regular: 1.2, degradado: 1.5 } as const;
const accessFactor = { facil: 1, medio: 1.15, dificil: 1.3 } as const;
const finishFactor = { baixo: 0.92, medio: 1, alto: 1.18 } as const;

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
  technicalCategorySet.has(category as TechnicalBudgetCategory) ? (category as TechnicalBudgetCategory) : null;

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
  surfaceCondition = 'regular',
  access = 'facil',
  height = 3,
  finishStandard = 'medio',
  propertyType,
}: CalculateBudgetInput): PricingResult => {
  const technicalCategory = toTechnicalCategory(category);
  const safeArea = safeNumber(area, 0.1);

  if (!technicalCategory) {
    return defaultPricingResult(category);
  }

  const composition = categoryCompositions[technicalCategory];
  const complexityMultiplier = complexityFactor[complexity];
  const conditionMultiplier = surfaceFactor[surfaceCondition];
  const accessMultiplier = accessFactor[access];
  const finishMultiplier = finishFactor[finishStandard];
  const heightMultiplier = height > 3 ? 1.1 : 1;

  const paintCoverage = materialsDatabase.tinta_latex.coverage;
  const puttyConsumption = materialsDatabase.massa_corrida.consumption;

  const materialItems: MaterialItem[] = [
    {
      code: 'tinta_latex',
      name: materialsDatabase.tinta_latex.name,
      unit: materialsDatabase.tinta_latex.unit,
      quantity: round2((safeArea / paintCoverage) * conditionMultiplier),
      unitCost: materialsDatabase.tinta_latex.price,
      totalCost: 0,
    },
    {
      code: 'massa_corrida',
      name: materialsDatabase.massa_corrida.name,
      unit: materialsDatabase.massa_corrida.unit,
      quantity: round2(((safeArea * puttyConsumption) / 20) * conditionMultiplier),
      unitCost: materialsDatabase.massa_corrida.price,
      totalCost: 0,
    },
  ].map((item) => ({ ...item, totalCost: round2(item.quantity * item.unitCost * finishMultiplier) }));

  const laborHours = round2(safeArea / laborDatabase.pintor.productivity);
  const laborItems: LaborItem[] = [
    {
      code: 'pintor',
      name: laborDatabase.pintor.name,
      unit: 'hora',
      quantity: laborHours,
      unitCost: laborDatabase.pintor.costPerHour,
      totalCost: round2(laborHours * laborDatabase.pintor.costPerHour * conditionMultiplier * accessMultiplier * heightMultiplier),
    },
  ];

  const materialSubtotal = round2(materialItems.reduce((sum, item) => sum + item.totalCost, 0));
  const laborSubtotal = round2(laborItems.reduce((sum, item) => sum + item.totalCost, 0));

  const mobilizationKey = accessType ?? composition.defaultMobilization;
  const mobilizationCost = mobilizationKey ? round2(baseMobilizationCosts[mobilizationKey]) : 0;

  const complexityCost = round2((materialSubtotal + laborSubtotal) * (complexityMultiplier - 1));
  const accessCost = round2((materialSubtotal + laborSubtotal) * (accessMultiplier - 1));
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
      `Tipo de imóvel: ${propertyType ?? 'não informado'}.`,
      `Fatores aplicados — Condição (${surfaceCondition}: ${conditionMultiplier}), Acesso (${access}: ${accessMultiplier}), Altura (${height}m: ${heightMultiplier}), Acabamento (${finishStandard}: ${finishMultiplier}).`,
      `Fator de complexidade aplicado: ${complexity} (${complexityMultiplier}).`,
    ],
  };
};
