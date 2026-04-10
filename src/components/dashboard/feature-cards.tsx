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
  <section className="grid gap-3 sm:gap-4 md:grid-cols-3">
    {features.map((feature) => (
      <Card
        key={feature.title}
        className="group p-4 transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md sm:p-5"
      >
        <div className="mb-3 sm:mb-4">
          <IconOrFallback src={feature.icon} title={feature.title} />
        </div>
        <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{feature.description}</p>
        <div className="mt-3 h-0.5 w-0 rounded-full bg-secondary transition-all duration-300 group-hover:w-20 sm:mt-4" />
      </Card>
    ))}
  </section>
);
