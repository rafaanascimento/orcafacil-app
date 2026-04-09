import type { BudgetTemplate } from '@/types/budget';

export const reformaGeralTemplate: BudgetTemplate = {
  diagnostico: [
    'Visita técnica para levantamento global das necessidades.',
    'Priorização de etapas por impacto funcional e estético.',
  ],
  escopo: [
    'Planejamento macro de execução e logística da obra.',
    'Intervenções civis pontuais conforme demanda levantada.',
    'Acabamentos finais para entrega técnica do serviço.',
  ],
  materiais: [
    'Materiais diversos conforme escopo consolidado.',
    'Itens de proteção, fixação e acabamento geral.',
  ],
  mao_de_obra: [
    'Equipe multidisciplinar com coordenação de obra.',
  ],
  cronograma: {
    baixa: ['Execução estimada entre 5 e 10 dias úteis.'],
    media: ['Execução estimada entre 10 e 20 dias úteis.'],
    alta: ['Execução estimada entre 20 e 35 dias úteis.'],
  },
  observacoes: [
    'Cronograma detalhado é refinado após vistoria presencial.',
    'Custos podem ser ajustados conforme definições de acabamento.',
  ],
};
