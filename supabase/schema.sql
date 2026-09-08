create table public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  fecha date not null,
  descripcion text,
  flyer_url text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.eventos enable row level security;

create policy "Los eventos activos son públicos"
  on public.eventos for select
  using (activo = true);

create policy "Administradores gestionan eventos"
  on public.eventos for all
  to authenticated
  using (true)
  with check (true);

insert into storage.buckets (id, name, public) values ('flyers', 'flyers', true)
on conflict (id) do nothing;
