import { familyProfiles } from '@/data/pricing/families';
import { drywallTemplate } from '@/data/templates/drywall';
import { fachadaTemplate } from '@/data/templates/fachada';
import { hidraulicaTemplate } from '@/data/templates/hidraulica';
import { pinturaTemplate } from '@/data/templates/pintura';
import { reformaGeralTemplate } from '@/data/templates/reforma-geral';
import { classifyBudgetCategory } from '@/lib/budget/classifiers';
import { getBudgetFamily } from '@/lib/budget/presentation';
import { calculateBudget } from '@/lib/pricing/calculate-budget';
import type { BudgetCategory, BudgetTemplate, GenerateBudgetInput, GeneratedBudget, TechnicalBudgetCategory } from '@/types/budget';

const templateMap: Record<BudgetCategory, BudgetTemplate> = {
  pintura_interna: pinturaTemplate,
  pintura_externa: fachadaTemplate,
  percussao_simples: fachadaTemplate,
  percussao_irata: fachadaTemplate,
  fachada_ceramica: fachadaTemplate,
  fachada_textura: fachadaTemplate,
  impermeabilizacao_reservatorio: hidraulicaTemplate,
  fachada: fachadaTemplate,
  pintura: pinturaTemplate,
  drywall: drywallTemplate,
  hidraulica: hidraulicaTemplate,
  'reforma-geral': reformaGeralTemplate,
};

const complexityLabels = {
  baixa: 'Complexidade baixa: execução direta com menor interferência operacional.',
  media: 'Complexidade média: exige coordenação técnica moderada.',
  alta: 'Complexidade alta: demanda planejamento ampliado e maior controle de execução.',
} as const;

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

const isTechnicalCategory = (category: BudgetCategory): category is TechnicalBudgetCategory =>
  category in familyProfiles;

const money = (value: number) =>
  value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

export const generateBudget = ({ description, area, complexity }: GenerateBudgetInput): GeneratedBudget => {
  const category = classifyBudgetCategory(description);
  const pricing = calculateBudget({ category, area, complexity });

  if (isTechnicalCategory(category)) {
    const profile = familyProfiles[category];

    return {
      category,
      pricing,
      result: {
        pricing,
        executive: {
          service: profile.serviceName,
          family: getBudgetFamily(category),
          objective: profile.objective,
          area,
        },
        diagnostico: [
          `Serviço: ${profile.serviceName}.`,
          `Área de referência: ${area} m².`,
          `Objetivo: ${profile.objective}`,
        ],
        escopo: profile.scope,
        materiais: pricing.materials.map((item) => `${item.name}: ${item.quantity} ${item.unit}.`),
        mao_de_obra: [
          ...pricing.labor.map((item) => `${item.name}: ${item.quantity} ${item.unit}.`),
          complexityLabels[complexity],
        ],
        cronograma: profile.schedule[complexity],
        observacoes: [
          ...profile.observations,
          ...pricing.notes,
          `Composição de custos preliminar — Materiais: ${money(pricing.materialSubtotal)}, Mão de obra: ${money(pricing.laborSubtotal)}, Total estimado: ${money(pricing.totalCost)}.`,
          'Orçamento executivo preliminar sujeito à vistoria técnica de validação.',
        ],
      },
    };
  }

  const template = templateMap[category] ?? reformaGeralTemplate;

  return {
    category,
    pricing,
    result: {
      pricing,
      executive: {
        service: 'Serviço Técnico Geral',
        family: getBudgetFamily(category),
        objective: 'Consolidar escopo técnico preliminar para validação em vistoria.',
        area,
      },
      diagnostico: [...template.diagnostico, `Resumo da solicitação: ${description.trim()}`],
      escopo: template.escopo,
      materiais: template.materiais,
      mao_de_obra: [...template.mao_de_obra, complexityLabels[complexity]],
      cronograma: template.cronograma[complexity],
      observacoes: [...template.observacoes, 'Valores finais devem ser confirmados após vistoria técnica.'],
    },
  };
};
