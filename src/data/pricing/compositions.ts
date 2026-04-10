import type { AccessType, TechnicalBudgetCategory } from '@/types/budget';

export interface CompositionMaterialConfig {
  code: string;
  consumptionPerM2: number;
}

export interface CompositionLaborConfig {
  code: string;
  productivityM2PerDay: number;
  fixedDays?: number;
}

export interface CategoryComposition {
  materials: CompositionMaterialConfig[];
  labor: CompositionLaborConfig[];
  minCost?: number;
  defaultMobilization?: AccessType;
  accessAdditionalByM2?: number;
  notes: string[];
}

export const complexityFactor = {
  baixa: 1,
  media: 1.1,
  alta: 1.25,
} as const;

export const categoryCompositions: Record<TechnicalBudgetCategory, CategoryComposition> = {
  pintura_interna: {
    materials: [
      { code: 'massa_corrida_25kg', consumptionPerM2: 0.09 },
      { code: 'selador_18l', consumptionPerM2: 0.05 },
      { code: 'tinta_acrilica_interna_18l', consumptionPerM2: 0.06 },
      { code: 'epi_consumiveis', consumptionPerM2: 0.01 },
    ],
    labor: [
      { code: 'pintor_dia', productivityM2PerDay: 45 },
      { code: 'servente_dia', productivityM2PerDay: 70 },
    ],
    minCost: 1800,
    defaultMobilization: 'simples',
    notes: ['Inclui preparo superficial, massa corrida, selador e pintura final.'],
  },
  pintura_externa: {
    materials: [
      { code: 'selador_18l', consumptionPerM2: 0.06 },
      { code: 'tinta_acrilica_externa_18l', consumptionPerM2: 0.07 },
      { code: 'primer_preparo_18l', consumptionPerM2: 0.03 },
      { code: 'epi_consumiveis', consumptionPerM2: 0.015 },
    ],
    labor: [
      { code: 'pintor_dia', productivityM2PerDay: 32 },
      { code: 'servente_dia', productivityM2PerDay: 52 },
    ],
    defaultMobilization: 'andaime',
    accessAdditionalByM2: 6,
    minCost: 2600,
    notes: ['Produtividade externa reduzida e adicional potencial por acesso.'],
  },
  percussao_simples: {
    materials: [{ code: 'epi_consumiveis', consumptionPerM2: 0.01 }],
    labor: [
      { code: 'tecnico_percussao_dia', productivityM2PerDay: 180 },
      { code: 'encarregado_dia', productivityM2PerDay: 320 },
    ],
    defaultMobilization: 'simples',
    minCost: 2200,
    notes: ['Inspeção por percussão em área acessível com custo operacional mínimo.'],
  },
  percussao_irata: {
    materials: [{ code: 'epi_consumiveis', consumptionPerM2: 0.03 }],
    labor: [
      { code: 'equipe_irata_dia', productivityM2PerDay: 95 },
      { code: 'encarregado_dia', productivityM2PerDay: 260 },
    ],
    defaultMobilization: 'irata',
    minCost: 5400,
    notes: ['Mobilização IRATA obrigatória e produtividade específica de acesso por corda.'],
  },
  fachada_ceramica: {
    materials: [
      { code: 'argamassa_ac3_20kg', consumptionPerM2: 0.34 },
      { code: 'rejunte_5kg', consumptionPerM2: 0.13 },
      { code: 'ceramica_m2', consumptionPerM2: 1.1 },
      { code: 'epi_consumiveis', consumptionPerM2: 0.02 },
    ],
    labor: [
      { code: 'pedreiro_dia', productivityM2PerDay: 16 },
      { code: 'servente_dia', productivityM2PerDay: 24 },
    ],
    defaultMobilization: 'balancim',
    minCost: 4200,
    notes: ['Inclui remoção pontual, preparo de base, assentamento, rejunte e limpeza técnica.'],
  },
  fachada_textura: {
    materials: [
      { code: 'selador_18l', consumptionPerM2: 0.06 },
      { code: 'textura_acrilica_25kg', consumptionPerM2: 0.11 },
      { code: 'primer_preparo_18l', consumptionPerM2: 0.025 },
      { code: 'epi_consumiveis', consumptionPerM2: 0.016 },
    ],
    labor: [
      { code: 'pintor_dia', productivityM2PerDay: 26 },
      { code: 'servente_dia', productivityM2PerDay: 38 },
    ],
    defaultMobilization: 'andaime',
    minCost: 3600,
    notes: ['Executa preparação de base, selador, textura e acabamento final.'],
  },
};
