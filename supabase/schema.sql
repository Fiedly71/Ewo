-- Tables Supabase utilisées par Ewo (avis clients et newsletter).
-- À exécuter une fois dans Supabase > SQL Editor.
-- Le site écrit avec la clé service_role (côté serveur uniquement) ;
-- RLS est activé pour que la clé publique anon ne puisse rien modifier.

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  author text not null check (char_length(author) between 1 and 60),
  rating smallint not null check (rating between 1 and 5),
  title text check (title is null or char_length(title) <= 120),
  body text not null check (char_length(body) between 10 and 2000),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists product_reviews_product_idx
  on public.product_reviews (product_id, approved, created_at desc);

alter table public.product_reviews enable row level security;

-- Lecture publique des seuls avis approuvés (utile si un jour le navigateur lit directement).
drop policy if exists "Avis approuvés lisibles" on public.product_reviews;
create policy "Avis approuvés lisibles" on public.product_reviews
  for select to anon, authenticated using (approved = true);

create table if not exists public.newsletter_subscribers (
  email text primary key check (char_length(email) <= 254),
  source text,
  created_at timestamptz not null default now()
);

-- Aucune politique : seule la clé service_role (serveur) peut lire ou écrire.
alter table public.newsletter_subscribers enable row level security;

-- Pour publier un avis : passez approved à true dans Table Editor.
