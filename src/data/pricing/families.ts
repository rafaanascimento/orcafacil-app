import type { BudgetComplexity, TechnicalBudgetCategory } from '@/types/budget';

interface FamilyProfile {
  serviceName: string;
  objective: string;
  scope: string[];
  schedule: Record<BudgetComplexity, string[]>;
  observations: string[];
}

export const familyProfiles: Record<TechnicalBudgetCategory, FamilyProfile> = {
  percussao_simples: {
    serviceName: 'Teste de Percussão',
    objective: 'Identificar áreas com desplacamento e som cavo para priorização de recuperação.',
    scope: [
      'Inspeção por percussão com marcação técnica dos pontos críticos.',
      'Registro fotográfico e relatório técnico simplificado.',
      'Consolidação de mapa preliminar de intervenção.',
    ],
    schedule: {
      baixa: ['Etapa única com entrega em até 2 dias úteis.'],
      media: ['Inspeção em até 3 dias úteis com relatório consolidado.'],
      alta: ['Inspeção faseada com relatório em até 5 dias úteis.'],
    },
    observations: ['Acesso simples por padrão; acessos especiais são avaliados separadamente.'],
  },
  percussao_irata: {
    serviceName: 'Teste de Percussão com IRATA',
    objective: 'Realizar inspeção técnica em altura com acesso por corda e segurança operacional.',
    scope: [
      'Mobilização IRATA e isolamento operacional da área.',
      'Inspeção por percussão com marcação de pontos críticos em fachada.',
      'Registro fotográfico e relatório técnico simplificado.',
    ],
    schedule: {
      baixa: ['Mobilização e inspeção em até 3 dias úteis.'],
      media: ['Inspeção faseada em até 5 dias úteis.'],
      alta: ['Inspeção complexa em até 7 dias úteis com frentes simultâneas.'],
    },
    observations: ['Execução condicionada às condições climáticas e plano de acesso vertical.'],
  },
  fachada_ceramica: {
    serviceName: 'Reforma em Fachada Cerâmica',
    objective: 'Recuperar revestimento cerâmico com segurança, aderência e acabamento técnico.',
    scope: [
      'Remoção de peças comprometidas e preparo de base.',
      'Regularização, reassentamento e rejuntamento técnico.',
      'Limpeza final e inspeção de qualidade do revestimento.',
    ],
    schedule: {
      baixa: ['Execução em até 6 dias úteis por etapas.'],
      media: ['Execução em até 10 dias úteis com controle de frentes.'],
      alta: ['Execução em até 14 dias úteis com logística ampliada.'],
    },
    observations: ['Pode demandar mobilização com balancim/andaime conforme acesso.'],
  },
  fachada_textura: {
    serviceName: 'Reforma em Fachada com Textura',
    objective: 'Recuperar superfície externa com sistema texturizado e acabamento homogêneo.',
    scope: [
      'Preparo e regularização da base da fachada.',
      'Aplicação de selador e textura técnica.',
      'Acabamento final e limpeza da área de trabalho.',
    ],
    schedule: {
      baixa: ['Execução em até 5 dias úteis.'],
      media: ['Execução em até 8 dias úteis.'],
      alta: ['Execução em até 12 dias úteis por etapas.'],
    },
    observations: ['Prazo sujeito a interferências climáticas e restrições de acesso.'],
  },
  pintura_interna: {
    serviceName: 'Pintura Geral Interna',
    objective: 'Renovar superfícies internas com preparação adequada e acabamento uniforme.',
    scope: [
      'Raspagem, lixamento e correções localizadas com massa.',
      'Aplicação de selador/fundo preparador.',
      'Pintura final com proteção de áreas e limpeza de entrega.',
    ],
    schedule: {
      baixa: ['Execução em até 4 dias úteis.'],
      media: ['Execução em até 7 dias úteis.'],
      alta: ['Execução em até 10 dias úteis com frentes setorizadas.'],
    },
    observations: ['Tonalidade final pode variar conforme iluminação e absorção do substrato.'],
  },
  pintura_externa: {
    serviceName: 'Pintura Geral Externa',
    objective: 'Requalificar superfícies externas com proteção e acabamento durável.',
    scope: [
      'Preparo de superfície com raspagem/lixamento e correções.',
      'Aplicação de selador/fundo com proteção de áreas adjacentes.',
      'Pintura externa de acabamento com revisão final.',
    ],
    schedule: {
      baixa: ['Execução em até 5 dias úteis.'],
      media: ['Execução em até 8 dias úteis.'],
      alta: ['Execução em até 12 dias úteis com logística de acesso.'],
    },
    observations: ['Produtividade condicionada a acesso e condições climáticas.'],
  },
  impermeabilizacao_reservatorio: {
    serviceName: 'Impermeabilização de Reservatório',
    objective: 'Garantir estanqueidade e proteção sanitária da estrutura do reservatório.',
    scope: [
      'Preparo e limpeza técnica da superfície interna.',
      'Regularização e aplicação do sistema impermeabilizante.',
      'Cura, teste de estanqueidade e liberação técnica preliminar.',
    ],
    schedule: {
      baixa: ['Execução em até 5 dias úteis incluindo cura inicial.'],
      media: ['Execução em até 8 dias úteis com testes intermediários.'],
      alta: ['Execução em até 12 dias úteis com janela de cura ampliada.'],
    },
    observations: ['Operação deve seguir protocolo sanitário e restrição de uso do reservatório durante cura.'],
  },
};
