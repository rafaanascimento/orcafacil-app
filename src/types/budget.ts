export type BudgetComplexity = 'baixa' | 'media' | 'alta';

export type BudgetCategory =
  | 'fachada'
  | 'pintura'
  | 'drywall'
  | 'hidraulica'
  | 'reforma-geral';

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
}

export interface BudgetRecord {
  id: string;
  service_description: string;
  area: number;
  complexity: BudgetComplexity;
  category: BudgetCategory;
  result_json: BudgetResultJson;
  created_at: string;
}
