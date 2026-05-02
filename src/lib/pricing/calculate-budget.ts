import { baseMobilizationCosts } from '@/data/pricing/base-costs';
import { categoryCompositions } from '@/data/pricing/compositions';
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
const finishFactor = { baixo: 0.9, medio: 1, alto: 1.25 } as const;
const complexityFactor = { baixa: 0.95, media: 1, alta: 1.2 } as const;

const materialsDatabase = {
  tinta_latex: { code: 'tinta_latex', name: 'Tinta Látex', unit: 'lata', price: 120, coverage: 18 },
  massa_corrida: { code: 'massa_corrida', name: 'Massa Corrida', unit: 'saco', price: 80, consumption: 1.2 },
} as const;

const laborDatabase = {
  pintor: { code: 'pintor', name: 'Pintor', unit: 'hora', costPerHour: 25, productivity: 10 },
} as const;

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
  propertyType,
  surfaceCondition = 'regular',
  access = 'facil',
  height = 3,
  finishStandard = 'medio',
}: CalculateBudgetInput): PricingResult => {
  const technicalCategory = toTechnicalCategory(category);
  if (!technicalCategory) return defaultPricingResult(category);

  const safeArea = safeNumber(area, 0.1);
  const composition = categoryCompositions[technicalCategory];

  const conditionMultiplier = surfaceFactor[surfaceCondition];
  const accessMultiplier = accessFactor[access];
  const standardMultiplier = finishFactor[finishStandard];
  const technicalComplexityMultiplier = complexityFactor[complexity];
  const heightMultiplier = height > 3 ? 1.1 : 1;
  const appliedFactor = round2(
    conditionMultiplier * accessMultiplier * standardMultiplier * technicalComplexityMultiplier * heightMultiplier,
  );

  const materials: MaterialItem[] = [
    {
      code: materialsDatabase.tinta_latex.code,
      name: materialsDatabase.tinta_latex.name,
      unit: materialsDatabase.tinta_latex.unit,
      quantity: round2(safeArea / materialsDatabase.tinta_latex.coverage),
      unitCost: materialsDatabase.tinta_latex.price,
      totalCost: 0,
    },
    {
      code: materialsDatabase.massa_corrida.code,
      name: materialsDatabase.massa_corrida.name,
      unit: materialsDatabase.massa_corrida.unit,
      quantity: round2((safeArea * materialsDatabase.massa_corrida.consumption) / 20),
      unitCost: materialsDatabase.massa_corrida.price,
      totalCost: 0,
    },
  ].map((item) => ({ ...item, totalCost: round2(item.quantity * item.unitCost * appliedFactor) }));

  const laborHours = round2(safeArea / laborDatabase.pintor.productivity);
  const labor: LaborItem[] = [
    {
      code: laborDatabase.pintor.code,
      name: laborDatabase.pintor.name,
      unit: laborDatabase.pintor.unit,
      quantity: laborHours,
      unitCost: laborDatabase.pintor.costPerHour,
      totalCost: round2(laborHours * laborDatabase.pintor.costPerHour * appliedFactor),
    },
  ];

  const materialSubtotal = round2(materials.reduce((total, item) => total + item.totalCost, 0));
  const laborSubtotal = round2(labor.reduce((total, item) => total + item.totalCost, 0));

  const mobilizationKey = accessType ?? composition.defaultMobilization;
  const mobilizationCost = mobilizationKey ? round2(baseMobilizationCosts[mobilizationKey]) : 0;
  const contingencyCost = round2((materialSubtotal + laborSubtotal) * 0.03);
  const totalCost = round2(materialSubtotal + laborSubtotal + mobilizationCost + contingencyCost);

  return {
    category,
    materials,
    labor,
    materialSubtotal,
    laborSubtotal,
    mobilizationCost,
    complexityCost: round2((materialSubtotal + laborSubtotal) * (technicalComplexityMultiplier - 1)),
    accessCost: round2((materialSubtotal + laborSubtotal) * (accessMultiplier - 1)),
    contingencyCost,
    minimumAdjustment: 0,
    additionalCost: contingencyCost,
    totalCost,
    notes: [
      ...composition.notes,
      `Tipo de imóvel: ${propertyType ?? 'não informado'}.`,
      `Fatores técnicos aplicados: condição ${surfaceCondition} (${conditionMultiplier}), acesso ${access} (${accessMultiplier}), acabamento ${finishStandard} (${standardMultiplier}), complexidade ${complexity} (${technicalComplexityMultiplier}), altura ${height}m (${heightMultiplier}).`,
    ],
  };
};
