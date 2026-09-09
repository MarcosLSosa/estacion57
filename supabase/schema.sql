create table if not exists public.perfiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text,
  rol text not null default 'editor' check (rol in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

alter table public.perfiles enable row level security;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol in ('admin', 'editor')
  );
$$;

create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombre', new.email));
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();

create policy "Los usuarios ven su perfil"
  on public.perfiles for select
  to authenticated
  using (id = auth.uid());

create table if not exists public.eventos (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  fecha date not null,
  descripcion text,
  flyer_url text,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.eventos enable row level security;

drop policy if exists "Los eventos activos son públicos" on public.eventos;
create policy "Los eventos activos son públicos"
  on public.eventos for select
  using (activo = true);

drop policy if exists "Administradores gestionan eventos" on public.eventos;
create policy "Administradores gestionan eventos"
  on public.eventos for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

insert into storage.buckets (id, name, public) values ('flyers', 'flyers', true)
on conflict (id) do nothing;

drop policy if exists "Administradores suben flyers" on storage.objects;
create policy "Administradores suben flyers"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'flyers' and public.es_admin());

drop policy if exists "Administradores actualizan flyers" on storage.objects;
create policy "Administradores actualizan flyers"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'flyers' and public.es_admin())
  with check (bucket_id = 'flyers' and public.es_admin());

drop policy if exists "Administradores eliminan flyers" on storage.objects;
create policy "Administradores eliminan flyers"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'flyers' and public.es_admin());

create table if not exists public.entradas (
  id uuid primary key default gen_random_uuid(),
  evento_id uuid references public.eventos(id) on delete cascade,
  codigo text not null unique,
  nombre text,
  email text,
  usada boolean not null default false,
  usada_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.ingresos (
  id uuid primary key default gen_random_uuid(),
  entrada_id uuid not null references public.entradas(id) on delete cascade,
  validado_por uuid not null references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.entradas enable row level security;
alter table public.ingresos enable row level security;

drop policy if exists "Administradores gestionan entradas" on public.entradas;
create policy "Administradores gestionan entradas"
  on public.entradas for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

drop policy if exists "Administradores registran ingresos" on public.ingresos;
create policy "Administradores registran ingresos"
  on public.ingresos for all
  to authenticated
  using (public.es_admin())
  with check (public.es_admin());

create or replace function public.validar_entrada(codigo_entrada text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  entrada public.entradas;
begin
  if not public.es_admin() then
    return json_build_object('ok', false, 'estado', 'no autorizado');
  end if;

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
