# OrçaFácil

Base completa de um app web responsivo para geração de orçamento técnico, construído com **Next.js App Router**, **TypeScript**, **Tailwind CSS** e **Supabase**, pronto para deploy na **Vercel**.

## Visão geral

O OrçaFácil permite:
- autenticação de usuário (login e cadastro);
- geração de orçamento técnico por descrição + área + complexidade;
- classificação automática por categoria (fachada, pintura, drywall, hidráulica ou reforma geral);
- exibição imediata do orçamento estruturado;
- salvamento no Supabase na tabela `budgets`;
- consulta de histórico de orçamentos em ordem decrescente.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase JS (`@supabase/supabase-js` + `@supabase/ssr`)

## Rotas

- `/` → redireciona para `/dashboard` (usuário logado) ou `/login` (usuário deslogado)
- `/login`
- `/dashboard` (protegida)
- `/history` (protegida)

## Variáveis de ambiente

Crie um arquivo `.env.local` na raiz com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_ANON
```

Essas variáveis são usadas tanto no client quanto no server para autenticação e persistência dos dados.

## Banco de dados (Supabase)

Estrutura mínima esperada:

### `profiles`
- tabela de perfil do usuário (opcional nesta primeira base, mas prevista no projeto).

### `budgets`
Campos esperados:
- `id`
- `user_id`
- `service_description`
- `area`
- `complexity`
- `category`
- `result_json`
- `created_at`

`result_json` segue a estrutura:

```json
{
  "diagnostico": ["..."],
  "escopo": ["..."],
  "materiais": ["..."],
  "mao_de_obra": ["..."],
  "cronograma": ["..."],
  "observacoes": ["..."]
}
```

## Assets públicos

Estrutura preparada no projeto (sem binários nesta base):

- `public/images/branding/.gitkeep`
- `public/images/icons/.gitkeep`

O código já referencia os caminhos abaixo e aplica fallback visual caso as imagens ainda não existam:

- `/images/branding/logo-full.png`
- `/images/branding/logo-icon.png`
- `/images/branding/login-bg.png`
- `/images/icons/escopo.png`
- `/images/icons/custos.png`
- `/images/icons/cronograma.png`

## Deploy na Vercel

1. Suba o repositório no GitHub.
2. Importe o projeto na Vercel.
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Faça deploy.

## Estrutura principal

```bash
src/
  app/
  components/
  data/
  lib/
  types/
public/images/
```

## Observações de implementação

- Proteção de rota feita via `middleware.ts` + validações no server.
- Geração de orçamento funciona localmente por templates em `src/data/templates`.
- A dashboard salva o orçamento no Supabase com feedback amigável de sucesso/erro.
- Interface mobile-first e responsiva para desktop e mobile web.
