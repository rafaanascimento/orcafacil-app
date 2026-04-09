import type { BudgetTemplate } from '@/types/budget';

export const drywallTemplate: BudgetTemplate = {
  diagnostico: [
    'Validação das medidas e pontos de interferência do ambiente.',
    'Definição da melhor modulação para placas e perfis metálicos.',
  ],
  escopo: [
    'Montagem de estrutura metálica galvanizada.',
    'Instalação de placas de gesso acartonado.',
    'Tratamento de juntas e acabamento para pintura.',
  ],
  materiais: [
    'Perfis metálicos e guias de fixação.',
    'Placas de drywall ST/RU conforme necessidade.',
    'Fitas para juntas e massa específica.',
  ],
  mao_de_obra: [
    'Montador de drywall e profissional para acabamento fino.',
  ],
  cronograma: {
    baixa: ['Execução estimada entre 3 e 6 dias úteis.'],
    media: ['Execução estimada entre 6 e 9 dias úteis.'],
    alta: ['Execução estimada entre 9 e 14 dias úteis.'],
  },
  observacoes: [
    'Pode exigir reforços para suportar cargas suspensas.',
    'Recomenda-se prever passagens elétricas antes do fechamento.',
  ],
};
