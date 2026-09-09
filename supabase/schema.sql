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

create table public.entradas (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid references public.eventos(id) on delete cascade,
  codigo text not null unique,
  nombre text,
  email text,
  usada boolean not null default false,
  usada_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ingresos (
  id uuid primary key default gen_random_uuid(),
  entrada_id uuid not null references public.entradas(id) on delete cascade,
  validado_por uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.entradas enable row level security;
alter table public.ingresos enable row level security;

create policy "Administradores gestionan entradas"
  on public.entradas for all
  to authenticated
  using (true)
  with check (true);

create policy "Administradores registran ingresos"
  on public.ingresos for all
  to authenticated
  using (true)
  with check (true);

create or replace function public.validar_entrada(codigo_entrada text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  entrada public.entradas;
begin
  select * into entrada
  from public.entradas
  where codigo = codigo_entrada
  for update;

  if not found then
    return json_build_object('ok', false, 'estado', 'inexistente');
  end if;

  if entrada.usada then
    return json_build_object('ok', false, 'estado', 'usada', 'nombre', entrada.nombre);
  end if;

  update public.entradas
  set usada = true, usada_at = now()
  where id = entrada.id;

  insert into public.ingresos (entrada_id, validado_por)
  values (entrada.id, auth.uid());

  return json_build_object('ok', true, 'estado', 'validada', 'nombre', entrada.nombre);
end;
$$;

revoke all on function public.validar_entrada(text) from public;
grant execute on function public.validar_entrada(text) to authenticated;
