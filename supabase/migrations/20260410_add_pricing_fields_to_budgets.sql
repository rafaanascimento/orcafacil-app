-- Safe migration: adds optional financial columns for backward compatibility.
alter table if exists public.budgets
  add column if not exists material_subtotal numeric,
  add column if not exists labor_subtotal numeric,
  add column if not exists mobilization_cost numeric,
  add column if not exists additional_cost numeric,
  add column if not exists total_cost numeric,
  add column if not exists pricing_json jsonb;

create index if not exists budgets_total_cost_idx on public.budgets (total_cost);
