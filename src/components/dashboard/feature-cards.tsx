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
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-base font-semibold text-primary sm:h-14 sm:w-14 sm:rounded-2xl sm:text-lg">
        {title.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="h-11 w-11 rounded-xl bg-blue-50 object-contain p-1.5 sm:h-14 sm:w-14 sm:rounded-2xl sm:p-2"
      onError={() => setFailed(true)}
    />
  );
};

export const FeatureCards = () => (
  <section className="rounded-2xl border border-slate-200/70 bg-slate-50/60 p-3 sm:p-4">
    <div className="mb-3 sm:mb-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Como funciona</p>
      <h2 className="mt-1 text-base font-bold text-ink sm:text-lg">Fluxo técnico simplificado</h2>
    </div>

    <div className="grid gap-2.5 sm:gap-3 md:grid-cols-3">
      {features.map((feature) => (
        <Card
          key={feature.title}
          className="group p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-4"
        >
          <div className="mb-2.5 sm:mb-3">
            <IconOrFallback src={feature.icon} title={feature.title} />
          </div>
          <h3 className="text-sm font-semibold text-ink sm:text-base">{feature.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:mt-1.5 sm:text-sm">{feature.description}</p>
          <div className="mt-2.5 h-0.5 w-0 rounded-full bg-secondary transition-all duration-300 group-hover:w-20 sm:mt-3" />
        </Card>
      ))}
    </div>
  </section>
);
