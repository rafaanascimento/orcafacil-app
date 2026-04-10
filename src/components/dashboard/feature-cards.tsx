'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'Escopo claro',
    description: 'Organize etapas e entregas técnicas com estrutura profissional e previsível.',
    icon: '/images/icons/escopo.png',
  },
  {
    title: 'Custos previsíveis',
    description: 'Monte propostas consistentes com base em área, categoria e complexidade real.',
    icon: '/images/icons/custos.png',
  },
  {
    title: 'Cronograma objetivo',
    description: 'Defina prazos técnicos com comunicação clara para clientes e equipes.',
    icon: '/images/icons/cronograma.png',
  },
];

const IconOrFallback = ({ src, title }: { src: string; title: string }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-semibold text-primary sm:h-12 sm:w-12 sm:rounded-xl sm:text-base">
        {title.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="h-9 w-9 rounded-lg bg-blue-50 object-contain p-1.5 sm:h-12 sm:w-12 sm:rounded-xl sm:p-2"
      onError={() => setFailed(true)}
    />
  );
};

export const FeatureCards = () => (
  <section className="rounded-2xl border border-slate-200/60 bg-slate-50/40 p-2.5 sm:p-4">
    <div className="mb-2.5 sm:mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Como funciona</p>
      <h2 className="mt-0.5 text-sm font-semibold text-ink sm:mt-1 sm:text-lg">Fluxo técnico simplificado</h2>
    </div>

    <div className="grid gap-2 sm:gap-3 md:grid-cols-3">
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="group p-3 transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-4"
        >
          <div className="mb-2 sm:mb-3">
            <IconOrFallback src={feature.icon} title={feature.title} />
          </div>
          <h3 className="text-sm font-semibold text-ink">{feature.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:mt-1.5 sm:text-sm">{feature.description}</p>
          <div className="mt-2 h-0.5 w-0 rounded-full bg-secondary transition-all duration-300 group-hover:w-20 sm:mt-3" />
        </Card>
      ))}
    </div>
  </section>
);
