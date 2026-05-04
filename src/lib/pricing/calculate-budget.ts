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
const bdiFactor = 1.25;

const materialsDatabase = {
  tinta_latex: { code: 'tinta_latex', name: 'Tinta Látex Premium', unit: 'lata 18L', price: 285, coverage: 120 },
  massa_corrida: { code: 'massa_corrida', name: 'Massa Corrida PVA', unit: 'saco 25kg', price: 68, consumption: 1.1 },
} as const;

const laborDatabase = {
  pintor: { code: 'pintor', name: 'Pintor Profissional', unit: 'hora', costPerHour: 32, productivity: 7 },
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
  const factor = round2(
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
      quantity: round2((safeArea * materialsDatabase.massa_corrida.consumption) / 25),
      unitCost: materialsDatabase.massa_corrida.price,
      totalCost: 0,
    },
  ].map((item) => ({ ...item, totalCost: round2(item.quantity * item.unitCost) }));

  const laborHours = round2(safeArea / laborDatabase.pintor.productivity);
  const labor: LaborItem[] = [
    {
      code: laborDatabase.pintor.code,
      name: laborDatabase.pintor.name,
      unit: laborDatabase.pintor.unit,
      quantity: laborHours,
      unitCost: laborDatabase.pintor.costPerHour,
      totalCost: round2(laborHours * laborDatabase.pintor.costPerHour),
    },
  ];

  const materialSubtotal = round2(materials.reduce((total, item) => total + item.totalCost, 0));
  const laborSubtotal = round2(labor.reduce((total, item) => total + item.totalCost, 0));
  const baseTotal = round2(materialSubtotal + laborSubtotal);

  const factorAdjustedTotal = round2(baseTotal * factor);
  const totalWithBdi = round2(factorAdjustedTotal * bdiFactor);

  const mobilizationKey = accessType ?? composition.defaultMobilization;
  const mobilizationCost = mobilizationKey ? round2(baseMobilizationCosts[mobilizationKey]) : 0;
  const contingencyCost = round2(baseTotal * 0.03);
  const totalCost = round2(totalWithBdi + mobilizationCost);

  return {
    category,
    materials,
    labor,
    materialSubtotal,
    laborSubtotal,
    mobilizationCost,
    complexityCost: round2(baseTotal * (technicalComplexityMultiplier - 1)),
    accessCost: round2(baseTotal * (accessMultiplier - 1)),
    contingencyCost,
    minimumAdjustment: 0,
    additionalCost: round2(totalCost - baseTotal),
    totalCost,
    notes: [
      ...composition.notes,
      `Tipo de imóvel: ${propertyType ?? 'não informado'}.`,
      `Fator técnico aplicado uma única vez: ${factor} (condição ${conditionMultiplier} × acesso ${accessMultiplier} × acabamento ${standardMultiplier} × complexidade ${technicalComplexityMultiplier} × altura ${heightMultiplier}).`,
      `BDI aplicado: ${bdiFactor} (25%).`,
      'Estimativa preliminar sujeita a vistoria técnica e ajustes executivos.',
      'Campos prontos para persistência futura: material_cost, labor_cost, total_cost.',
    ],
  };
};
