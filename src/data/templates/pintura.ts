import type { BudgetTemplate } from '@/types/budget';

export const pinturaTemplate: BudgetTemplate = {
  diagnostico: [
    'Análise do estado das superfícies para pintura.',
    'Identificação de descascamento, mofo e irregularidades.',
  ],
  escopo: [
    'Proteção de pisos e esquadrias.',
    'Raspagem, lixamento e aplicação de massa onde necessário.',
    'Aplicação de fundo preparador e pintura de acabamento.',
  ],
  materiais: [
    'Massa corrida/acrílica conforme ambiente.',
    'Selador acrílico.',
    'Tinta premium lavável.',
  ],
  mao_de_obra: [
    'Pintor profissional e auxiliar para preparação de superfície.',
  ],
  cronograma: {
    baixa: ['Execução estimada entre 2 e 4 dias úteis.'],
    media: ['Execução estimada entre 4 e 7 dias úteis.'],
    alta: ['Execução estimada entre 7 e 10 dias úteis.'],
  },
  observacoes: [
    'A tonalidade final pode variar conforme iluminação do ambiente.',
    'É importante respeitar o tempo de cura entre demãos.',
  ],
};
