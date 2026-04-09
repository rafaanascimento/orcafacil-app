import type { BudgetTemplate } from '@/types/budget';

export const fachadaTemplate: BudgetTemplate = {
  diagnostico: [
    'Levantamento técnico das patologias aparentes da fachada.',
    'Mapeamento de fissuras, trincas e áreas com infiltração.',
  ],
  escopo: [
    'Preparação e proteção das áreas de trabalho.',
    'Tratamento das trincas com selante e reforço localizado.',
    'Correção de pontos com umidade e recomposição de reboco.',
    'Acabamento final com pintura externa apropriada.',
  ],
  materiais: [
    'Selante elastomérico para fissuras.',
    'Argamassa de reparo estrutural.',
    'Fundo preparador e tinta acrílica premium.',
  ],
  mao_de_obra: [
    'Equipe com pedreiro especializado em recuperação de fachada.',
    'Pintor com experiência em acabamento externo.',
  ],
  cronograma: {
    baixa: ['Execução estimada entre 3 e 5 dias úteis.'],
    media: ['Execução estimada entre 5 e 8 dias úteis.'],
    alta: ['Execução estimada entre 8 e 12 dias úteis.'],
  },
  observacoes: [
    'Prazo pode variar conforme condições climáticas.',
    'Recomendado revisar pontos de drenagem e calhas em paralelo.',
  ],
};
