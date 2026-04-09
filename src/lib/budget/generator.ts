import { drywallTemplate } from '@/data/templates/drywall';
import { fachadaTemplate } from '@/data/templates/fachada';
import { hidraulicaTemplate } from '@/data/templates/hidraulica';
import { pinturaTemplate } from '@/data/templates/pintura';
import { reformaGeralTemplate } from '@/data/templates/reforma-geral';
import type {
  BudgetCategory,
  BudgetTemplate,
  GenerateBudgetInput,
  GeneratedBudget,
} from '@/types/budget';
import { classifyBudgetCategory } from './classifiers';

const templateMap: Record<BudgetCategory, BudgetTemplate> = {
  fachada: fachadaTemplate,
  pintura: pinturaTemplate,
  drywall: drywallTemplate,
  hidraulica: hidraulicaTemplate,
  'reforma-geral': reformaGeralTemplate,
};

const complexityLabels = {
  baixa: 'Complexidade baixa: execução mais direta e com menor interferência.',
  media: 'Complexidade média: requer maior atenção técnica e coordenação.',
  alta: 'Complexidade alta: demanda planejamento ampliado e gestão rigorosa.',
} as const;

const areaHint = (area: number) => {
  if (area <= 30) return 'Área enxuta com foco em execução ágil.';
  if (area <= 100) return 'Área intermediária com necessidade de planejamento por etapas.';
  return 'Área extensa com logística e organização de equipe ampliadas.';
};

export const generateBudget = ({ description, area, complexity }: GenerateBudgetInput): GeneratedBudget => {
  const category = classifyBudgetCategory(description);
  const template = templateMap[category];

  return {
    category,
    result: {
      diagnostico: [
        ...template.diagnostico,
        `Resumo da solicitação: ${description.trim()}`,
        areaHint(area),
      ],
      escopo: template.escopo,
      materiais: template.materiais,
      mao_de_obra: [
        ...template.mao_de_obra,
        complexityLabels[complexity],
      ],
      cronograma: template.cronograma[complexity],
      observacoes: [
        ...template.observacoes,
        'Valores finais devem ser confirmados após vistoria técnica.',
      ],
    },
  };
};
