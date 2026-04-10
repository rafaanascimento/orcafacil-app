export const baseMaterialCosts = {
  massa_corrida_25kg: { name: 'Massa corrida 25kg', unit: 'saco', unitCost: 84 },
  selador_18l: { name: 'Selador acrílico 18L', unit: 'lata', unitCost: 168 },
  tinta_acrilica_interna_18l: { name: 'Tinta acrílica interna 18L', unit: 'lata', unitCost: 298 },
  tinta_acrilica_externa_18l: { name: 'Tinta acrílica externa 18L', unit: 'lata', unitCost: 378 },
  textura_acrilica_25kg: { name: 'Textura acrílica 25kg', unit: 'balde', unitCost: 168 },
  argamassa_ac3_20kg: { name: 'Argamassa AC3 20kg', unit: 'saco', unitCost: 44 },
  rejunte_5kg: { name: 'Rejunte 5kg', unit: 'pacote', unitCost: 29 },
  ceramica_m2: { name: 'Cerâmica fachada', unit: 'm²', unitCost: 96 },
  primer_preparo_18l: { name: 'Fundo preparador 18L', unit: 'lata', unitCost: 186 },
  epi_consumiveis: { name: 'Insumos de proteção e consumo', unit: 'verba', unitCost: 120 },
} as const;

export const baseLaborCosts = {
  pintor_dia: { name: 'Pintor profissional', unit: 'diária', unitCost: 280 },
  servente_dia: { name: 'Servente', unit: 'diária', unitCost: 180 },
  pedreiro_dia: { name: 'Pedreiro', unit: 'diária', unitCost: 320 },
  encarregado_dia: { name: 'Encarregado', unit: 'diária', unitCost: 420 },
  tecnico_percussao_dia: { name: 'Técnico de percussão', unit: 'diária', unitCost: 420 },
  equipe_irata_dia: { name: 'Equipe IRATA', unit: 'diária', unitCost: 1450 },
} as const;

export const baseMobilizationCosts = {
  simples: 350,
  andaime: 980,
  balancim: 1650,
  irata: 2400,
} as const;
