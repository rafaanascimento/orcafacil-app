import { drywallTemplate } from '@/data/templates/drywall';
import { fachadaTemplate } from '@/data/templates/fachada';
import { hidraulicaTemplate } from '@/data/templates/hidraulica';
import { pinturaTemplate } from '@/data/templates/pintura';
import { reformaGeralTemplate } from '@/data/templates/reforma-geral';
import { classifyBudgetCategory } from '@/lib/budget/classifiers';
import { calculateBudget } from '@/lib/pricing/calculate-budget';
import type { BudgetCategory, BudgetTemplate, GenerateBudgetInput, GeneratedBudget } from '@/types/budget';

const templateMap: Record<BudgetCategory, BudgetTemplate> = {
  pintura_interna: pinturaTemplate,
  pintura_externa: fachadaTemplate,
  percussao_simples: fachadaTemplate,
  percussao_irata: fachadaTemplate,
  fachada_ceramica: fachadaTemplate,
  fachada_textura: fachadaTemplate,
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

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const generateBudget = ({ description, area, complexity }: GenerateBudgetInput): GeneratedBudget => {
  const category = classifyBudgetCategory(description);
  const template = templateMap[category] ?? reformaGeralTemplate;
  const pricing = calculateBudget({
    category,
    area,
    complexity,
  });

  return {
    category,
    pricing,
    result: {
      diagnostico: [
        ...template.diagnostico,
        `Resumo da solicitação: ${description.trim()}`,
        areaHint(area),
      ],
      escopo: template.escopo,
      materiais: [
        ...template.materiais,
        ...pricing.materials.slice(0, 4).map((item) => `${item.name}: ${item.quantity} ${item.unit}.`),
      ],
      mao_de_obra: [
        ...template.mao_de_obra,
        complexityLabels[complexity],
        ...pricing.labor.map((item) => `${item.name}: ${item.quantity} ${item.unit}.`),
      ],
      cronograma: template.cronograma[complexity],
      observacoes: [
        ...template.observacoes,
        ...pricing.notes,
        `Resumo financeiro preliminar — Materiais: ${money(pricing.materialSubtotal)}, Mão de obra: ${money(pricing.laborSubtotal)}, Mobilização: ${money(pricing.mobilizationCost)}, Total estimado: ${money(pricing.totalCost)}.`,
        'Valores finais devem ser confirmados após vistoria técnica.',
      ],
    },
  };
};
