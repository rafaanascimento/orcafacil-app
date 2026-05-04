export const compositions = {
  pintura_interna: {
    materials: [{ ref: 'selador' }, { ref: 'massa_corrida' }, { ref: 'tinta_latex' }],
    labor: [{ ref: 'pintor' }, { ref: 'ajudante' }],
  },
  fachada: {
    materials: [{ ref: 'selador' }, { ref: 'tinta_latex' }],
    labor: [{ ref: 'pintor' }],
  },
  percussao_simples: {
    materials: [],
    labor: [{ ref: 'tecnico' }],
    mobilization: 150,
  },
} as const;
