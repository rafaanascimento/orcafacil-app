'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'Escopo claro',
    description: 'Organize etapas e entregas técnicas com estrutura profissional.',
    icon: '/images/icons/escopo.png',
  },
  {
    title: 'Custos previsíveis',
    description: 'Monte propostas consistentes com base em complexidade e área.',
    icon: '/images/icons/custos.png',
  },
  {
    title: 'Cronograma objetivo',
    description: 'Apresente prazos estimados com linguagem técnica e segura.',
    icon: '/images/icons/cronograma.png',
  },
];

const IconOrFallback = ({ src, title }: { src: string; title: string }) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-xl text-primary">
        •
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className="h-14 w-14 rounded-xl bg-blue-50 object-contain p-2"
      onError={() => setFailed(true)}
    />
  );
};

export const FeatureCards = () => (
  <section className="grid gap-4 md:grid-cols-3">
    {features.map((feature) => (
      <Card key={feature.title} className="p-5">
        <div className="mb-4">
          <IconOrFallback src={feature.icon} title={feature.title} />
        </div>
        <h3 className="text-base font-semibold text-ink">{feature.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
      </Card>
    ))}
  </section>
);
