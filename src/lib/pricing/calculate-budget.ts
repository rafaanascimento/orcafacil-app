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

const surfaceFactor = { novo: 1, regular: 1.2, degradado: 1.5 } as const;
const accessFactor = { facil: 1, medio: 1.15, dificil: 1.3 } as const;
const finishFactor = { baixo: 0.9, medio: 1, alto: 1.25 } as const;
const complexityFactor = { baixa: 0.95, media: 1, alta: 1.2 } as const;
const bdi = 1.25;

const compositionByCategory = {
  pintura_interna: 'pintura_interna',
  pintura_externa: 'fachada',
  percussao_simples: 'percussao_simples',
  percussao_irata: 'percussao_simples',
  fachada_ceramica: 'fachada',
  fachada_textura: 'fachada',
  impermeabilizacao_reservatorio: 'fachada',
} as const satisfies Partial<Record<BudgetCategory, keyof typeof compositions>>;


const calculatePercussionBudget = ({
  category,
  area,
  propertyType,
  access = 'facil',
  height = 3,
}: Pick<CalculateBudgetInput, 'category' | 'area' | 'propertyType' | 'access' | 'height'>): PricingResult => {
  const safeArea = safeNumber(area, 0.1);
  const technicalProductivity = 20;
  const technicalCostPerHour = 80;
  const reportCost = 200;

  const mobilizationCost = propertyType === 'comercial' ? 300 : 150;
  const accessMultiplier = access === 'dificil' ? 1.3 : access === 'medio' ? 1.15 : 1;
  const heightMultiplier = height > 20 ? 1.4 : height > 10 ? 1.2 : 1;

  const hours = round2(safeArea / technicalProductivity);
  const laborSubtotal = round2(hours * technicalCostPerHour);
  const materialSubtotal = 0;
  const baseTotal = round2(laborSubtotal + mobilizationCost + reportCost);
  const totalCost = round2(baseTotal * accessMultiplier * heightMultiplier);

  return {
    category,
    materials: [],
    labor: [
      {
        code: 'tecnico',
        name: 'Técnico de inspeção',
        unit: 'hora',
        quantity: hours,
        unitCost: technicalCostPerHour,
        totalCost: laborSubtotal,
      },
    ],
    materialSubtotal,
    laborSubtotal,
    mobilizationCost,
    complexityCost: 0,
    accessCost: round2(baseTotal * (accessMultiplier - 1)),
    contingencyCost: 0,
    minimumAdjustment: 0,
    additionalCost: round2(totalCost - baseTotal),
    totalCost,
    notes: [
      'Serviço técnico especializado — não baseado em consumo de materiais.',
      `Produtividade aplicada: ${technicalProductivity} m²/h por técnico (1 técnico).`,
      `Custos fixos aplicados — Mobilização: R$ ${mobilizationCost.toFixed(2)}, Laudo técnico: R$ ${reportCost.toFixed(2)}.`,
      `Multiplicadores aplicados — Acesso (${access}: ${accessMultiplier}) e Altura (${height}m: ${heightMultiplier}).`,
      'Campos de persistência utilizados: material_cost, labor_cost, total_cost.',
    ],
  };
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
  if (category === 'percussao_simples') {
    return calculatePercussionBudget({ category, area, propertyType, access, height });
  }

  const compositionKey =
    category in compositionByCategory
      ? compositionByCategory[category as keyof typeof compositionByCategory]
      : 'pintura_interna';
  const composition = compositions[compositionKey];

  if (!composition) return defaultPricingResult(category);

  const safeArea = safeNumber(area, 0.1);

  const conditionMultiplier = surfaceFactor[surfaceCondition];
  const accessMultiplier = accessFactor[access];
  const standardMultiplier = finishFactor[finishStandard];
  const technicalComplexityMultiplier = complexityFactor[complexity];
  const heightMultiplier = height > 3 ? 1.1 : 1;
  const factor = round2(
    conditionMultiplier * accessMultiplier * standardMultiplier * technicalComplexityMultiplier * heightMultiplier,
  );

  const materials: MaterialItem[] = composition.materials.map((item) => {
    const material = materialsDatabase[item.ref];

    const quantity = 'coverage' in material
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

  const labor: LaborItem[] = composition.labor.map((item) => {
    const laborRef = laborDatabase[item.ref];
    const hours = round2(safeArea / laborRef.productivity);

    return {
      code: item.ref,
      name: laborRef.name,
      unit: 'hora',
      quantity: hours,
      unitCost: laborRef.costPerHour,
      totalCost: round2(hours * laborRef.costPerHour),
    };
  });

  const materialSubtotal = round2(materials.reduce((total, item) => total + item.totalCost, 0));
  const laborSubtotal = round2(labor.reduce((total, item) => total + item.totalCost, 0));

  const defaultMobilization = 'mobilization' in composition ? composition.mobilization : 0;
  const mappedMobilization = accessType ? round2(baseMobilizationCosts[accessType]) : 0;
  const mobilizationCost = round2(mappedMobilization || defaultMobilization);

  const baseTotal = round2(materialSubtotal + laborSubtotal + mobilizationCost);
  const totalCost = round2(baseTotal * factor * bdi);

  return {
    category,
    materials,
    labor,
    materialSubtotal,
    laborSubtotal,
    mobilizationCost,
    complexityCost: round2(baseTotal * (technicalComplexityMultiplier - 1)),
    accessCost: round2(baseTotal * (accessMultiplier - 1)),
    contingencyCost: round2(baseTotal * 0.03),
    minimumAdjustment: 0,
    additionalCost: round2(totalCost - baseTotal),
    totalCost,

    notes: [
      `Composição aplicada: ${compositionKey}.`,
      `Tipo de imóvel: ${propertyType ?? 'não informado'}.`,
      `Fator técnico único: ${factor} (condição ${conditionMultiplier} × acesso ${accessMultiplier} × acabamento ${standardMultiplier} × complexidade ${technicalComplexityMultiplier} × altura ${heightMultiplier}).`,
      `BDI aplicado: ${bdi} (25%).`,
      'Estimativa técnica preliminar sujeita à vistoria para fechamento executivo.',
      'Campos de persistência utilizados: material_cost, labor_cost, total_cost.',
    ],
  };
};
