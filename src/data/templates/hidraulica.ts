import type { BudgetTemplate } from '@/types/budget';

export const hidraulicaTemplate: BudgetTemplate = {
  diagnostico: [
    'Inspeção de pontos hidráulicos e possíveis vazamentos.',
    'Verificação de pressão, vedação e estado da tubulação.',
  ],
  escopo: [
    'Isolamento do trecho afetado para intervenção.',
    'Substituição de peças comprometidas e ajustes de conexões.',
    'Teste de estanqueidade e normalização do sistema.',
  ],
  materiais: [
    'Tubos e conexões compatíveis com a rede existente.',
    'Veda rosca e adesivo para PVC quando aplicável.',
    'Registros, sifões ou torneiras de reposição.',
  ],
  mao_de_obra: [
    'Encanador qualificado e auxiliar para apoio operacional.',
  ],
  cronograma: {
    baixa: ['Execução estimada entre 1 e 3 dias úteis.'],
    media: ['Execução estimada entre 3 e 5 dias úteis.'],
    alta: ['Execução estimada entre 5 e 8 dias úteis.'],
  },
  observacoes: [
    'Intervenções ocultas podem demandar abertura de alvenaria.',
    'Recomenda-se teste final com o imóvel em carga máxima.',
  ],
};
