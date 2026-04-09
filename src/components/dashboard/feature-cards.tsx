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
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-lg font-semibold text-primary">
        {title.slice(0, 1)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="h-14 w-14 rounded-2xl bg-blue-50 object-contain p-2"
      onError={() => setFailed(true)}
    />
  );
};

export const FeatureCards = () => (
  <section className="grid gap-4 md:grid-cols-3">
    {features.map((feature) => (
      <Card
        key={feature.title}
        className="group p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-md"
      >
        <div className="mb-4">
          <IconOrFallback src={feature.icon} title={feature.title} />
        </div>
        <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
        <div className="mt-4 h-0.5 w-0 rounded-full bg-secondary transition-all duration-300 group-hover:w-20" />
      </Card>
    ))}
  </section>
);
