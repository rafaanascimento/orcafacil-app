import { compositions } from '@/data/costs/compositions';
import { laborDatabase, materialsDatabase } from '@/data/costs/inputs';
import { baseMobilizationCosts } from '@/data/pricing/base-costs';
import type {
  AccessType,
  BudgetCategory,
  BudgetComplexity,
  LaborItem,
  MaterialItem,
  PricingResult,
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

// 🔧 Fatores técnicos
const surfaceFactor = { novo: 1, regular: 1.2, degradado: 1.5 } as const;
const accessFactor = { facil: 1, medio: 1.15, dificil: 1.3 } as const;
const finishFactor = { baixo: 0.9, medio: 1, alto: 1.25 } as const;
const complexityFactor = { baixa: 0.95, media: 1, alta: 1.2 } as const;

const BDI = 1.25;

// 🔗 Mapeamento de categoria → composição
const compositionByCategory: Partial<Record<BudgetCategory, keyof typeof compositions>> = {
  pintura_interna: 'pintura_interna',
  pintura_externa: 'fachada',
  percussao_simples: 'percussao_simples',
  percussao_irata: 'percussao_simples',
  fachada_ceramica: 'fachada',
  fachada_textura: 'fachada',
  impermeabilizacao_reservatorio: 'fachada',
};

// 🔒 fallback seguro
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
  // 🧠 Seleção de composição
  const compositionKey = compositionByCategory[category] ?? 'pintura_interna';
  const composition = compositions[compositionKey];

  if (!composition) return defaultPricingResult(category);

  const safeArea = safeNumber(area, 0.1);

  // 📊 Fatores
  const conditionMultiplier = surfaceFactor[surfaceCondition];
  const accessMultiplier = accessFactor[access];
  const finishMultiplier = finishFactor[finishStandard];
  const complexityMultiplier = complexityFactor[complexity];
  const heightMultiplier = height > 3 ? 1.1 : 1;

  const factor = round2(
    conditionMultiplier *
    accessMultiplier *
    finishMultiplier *
    complexityMultiplier *
    heightMultiplier
  );

  // 🧱 Materiais
  const materials: MaterialItem[] = composition.materials.map((item) => {
    const material = materialsDatabase[item.ref];

    const quantity =
      'coverage' in material
        ? round2(safeArea / material.coverage)
        : round2(safeArea * material.consumption);

    return {
      code: item.ref,
      name: material.name,
      unit: material.unit,
      quantity,
      unitCost: material.price,
      totalCost: round2(quantity * material.price),
    };
  });

  // 👷 Mão de obra
  const labor: LaborItem[] = composition.labor.map((item) => {
    const ref = laborDatabase[item.ref];

    const hours = round2(safeArea / ref.productivity);

    return {
      code: item.ref,
      name: ref.name,
      unit: 'hora',
      quantity: hours,
      unitCost: ref.costPerHour,
      totalCost: round2(hours * ref.costPerHour),
    };
  });

  // 💰 Subtotais
  const materialSubtotal = round2(
    materials.reduce((sum, item) => sum + item.totalCost, 0)
  );

  const laborSubtotal = round2(
    labor.reduce((sum, item) => sum + item.totalCost, 0)
  );

  // 🚚 Mobilização
  const baseMobilization =
    'mobilization' in composition ? composition.mobilization ?? 0 : 0;

  const mappedMobilization = accessType
    ? round2(baseMobilizationCosts[accessType])
    : 0;

  const mobilizationCost = round2(mappedMobilization || baseMobilization);

  // 📊 Total
  const baseTotal = round2(materialSubtotal + laborSubtotal + mobilizationCost);

  const totalCost = round2(baseTotal * factor * BDI);

  return {
    category,
    materials,
    labor,
    materialSubtotal,
    laborSubtotal,
    mobilizationCost,

    complexityCost: round2(baseTotal * (complexityMultiplier - 1)),
    accessCost: round2(baseTotal * (accessMultiplier - 1)),
    contingencyCost: round2(baseTotal * 0.03),

    minimumAdjustment: 0,
    additionalCost: round2(totalCost - baseTotal),
    totalCost,

    notes: [
      `Composição aplicada: ${compositionKey}.`,
      `Tipo de imóvel: ${propertyType ?? 'não informado'}.`,
      `Fator técnico: ${factor}.`,
      `BDI aplicado: ${BDI} (25%).`,
      'Estimativa preliminar sujeita à validação técnica.',
    ],
  };
};
