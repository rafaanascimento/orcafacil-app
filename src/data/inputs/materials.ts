export const materialsDatabase = {
  tinta_latex: {
    name: 'Tinta Látex',
    unit: 'lata',
    price: 120,
    coverage: 18,
  },
  massa_corrida: {
    name: 'Massa Corrida',
    unit: 'saco',
    price: 80,
    consumption: 1.2,
  },
} as const;

export const laborDatabase = {
  pintor: {
    name: 'Pintor',
    costPerHour: 25,
    productivity: 10,
  },
} as const;
