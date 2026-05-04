export const materialsDatabase = {
  tinta_latex: {
    name: 'Tinta Látex PVA',
    unit: 'lata',
    price: 140,
    coverage: 18,
  },
  massa_corrida: {
    name: 'Massa Corrida',
    unit: 'kg',
    price: 4.5,
    consumption: 1.2,
  },
  selador: {
    name: 'Selador Acrílico',
    unit: 'lata',
    price: 110,
    coverage: 20,
  },
} as const;

export const laborDatabase = {
  pintor: {
    name: 'Pintor',
    costPerHour: 30,
    productivity: 8,
  },
  ajudante: {
    name: 'Ajudante',
    costPerHour: 18,
    productivity: 12,
  },
  tecnico: {
    name: 'Técnico de inspeção',
    costPerHour: 80,
    productivity: 20,
  },
} as const;
