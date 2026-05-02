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
  impermeabilizante_bicomponente_18kg: { name: 'Impermeabilizante bicomponente 18kg', unit: 'kit', unitCost: 329 },
  argamassa_polimerica_20kg: { name: 'Argamassa polimérica 20kg', unit: 'saco', unitCost: 74 },
  martelo_borracha: { name: 'Martelo de borracha e acessórios', unit: 'verba', unitCost: 90 },
  insumos_relatorio: { name: 'Registro fotográfico e relatório técnico', unit: 'verba', unitCost: 160 },
  epi_consumiveis: { name: 'Insumos de proteção e consumo', unit: 'verba', unitCost: 120 },
} as const;

export const baseLaborCosts = {
  pintor_dia: { name: 'Pintor profissional', unit: 'diária', unitCost: 280 },
  servente_dia: { name: 'Servente', unit: 'diária', unitCost: 180 },
  pedreiro_dia: { name: 'Pedreiro', unit: 'diária', unitCost: 320 },
  encarregado_dia: { name: 'Encarregado', unit: 'diária', unitCost: 420 },
  tecnico_percussao_dia: { name: 'Técnico de percussão', unit: 'diária', unitCost: 420 },
  ajudante_dia: { name: 'Ajudante técnico', unit: 'diária', unitCost: 170 },
  equipe_irata_dia: { name: 'Equipe IRATA', unit: 'diária', unitCost: 1450 },
  impermeabilizador_dia: { name: 'Impermeabilizador técnico', unit: 'diária', unitCost: 360 },
} as const;

export const baseMobilizationCosts = {
  simples: 350,
  andaime: 980,
  balancim: 1650,
  irata: 2400,
} as const;
