export type BudgetComplexity = 'baixa' | 'media' | 'alta';

export type TechnicalBudgetCategory =
  | 'pintura_interna'
  | 'pintura_externa'
  | 'percussao_simples'
  | 'percussao_irata'
  | 'fachada_ceramica'
  | 'fachada_textura';

export type LegacyBudgetCategory =
  | 'fachada'
  | 'pintura'
  | 'drywall'
  | 'hidraulica'
  | 'reforma-geral';

export type BudgetCategory = TechnicalBudgetCategory | LegacyBudgetCategory;

export type AccessType = 'simples' | 'andaime' | 'balancim' | 'irata';

export interface MaterialItem {
  code: string;
  name: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface LaborItem {
  code: string;
  name: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface PricingResult {
  category: BudgetCategory;
  materials: MaterialItem[];
  labor: LaborItem[];
  materialSubtotal: number;
  laborSubtotal: number;
  mobilizationCost: number;
  additionalCost: number;
  totalCost: number;
  notes: string[];
}

export interface BudgetResultJson {
  diagnostico: string[];
  escopo: string[];
  materiais: string[];
  mao_de_obra: string[];
  cronograma: string[];
  observacoes: string[];
}

export interface BudgetTemplate {
  diagnostico: string[];
  escopo: string[];
  materiais: string[];
  mao_de_obra: string[];
  cronograma: {
    baixa: string[];
    media: string[];
    alta: string[];
  };
  observacoes: string[];
}

export interface GenerateBudgetInput {
  description: string;
  area: number;
  complexity: BudgetComplexity;
}

export interface GeneratedBudget {
  category: BudgetCategory;
  result: BudgetResultJson;
  pricing: PricingResult;
}

export interface BudgetRecord {
  id: string;
  service_description: string;
  area: number;
  complexity: BudgetComplexity;
  category: BudgetCategory;
  result_json: BudgetResultJson;
  pricing_json?: PricingResult | null;
  material_subtotal?: number | null;
  labor_subtotal?: number | null;
  mobilization_cost?: number | null;
  additional_cost?: number | null;
  total_cost?: number | null;
  created_at: string;
}
