create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  delivery text not null,
  address text not null,
  city text not null,
  notes text,
  status text not null default 'Pendiente' check (status in ('Pendiente', 'En preparacion', 'Completado', 'Con incidencia')),
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_name text not null,
  tier text not null,
  unit_price numeric(12,2) not null,
  package_units integer not null default 1,
  package_quantity integer not null default 1,
  subtotal numeric(12,2) not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_products (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete set null,
  name text not null,
  category text not null,
  material text not null,
  measure text not null,
  price_24 numeric(12,2) not null default 0,
  price_48 numeric(12,2) not null default 0,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  kind text not null default 'info' check (kind in ('success', 'warning', 'info')),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.site_banners (
  slot text primary key check (slot in ('primary', 'secondary')),
  eyebrow text not null,
  title text not null,
  body text not null,
  button_label text not null,
  link text not null,
  image_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.admin_products enable row level security;
alter table public.notifications enable row level security;
alter table public.site_banners enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = id);

create policy "orders_select_own"
on public.orders
for select
using (auth.uid() = user_id);

create policy "orders_insert_own"
on public.orders
for insert
with check (auth.uid() = user_id);

create policy "orders_insert_public"
on public.orders
for insert
with check (true);

create policy "order_items_select_own"
on public.order_items
for select
using (
  exists (
    select 1
    from public.orders
    where public.orders.id = order_items.order_id
      and public.orders.user_id = auth.uid()
  )
);

create policy "order_items_insert_public"
on public.order_items
for insert
with check (true);

create policy "notifications_select_own"
on public.notifications
for select
using (auth.uid() = user_id);

create policy "notifications_update_own"
on public.notifications
for update
using (auth.uid() = user_id);

create policy "admin_read_profiles"
on public.profiles
for select
using (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "admin_manage_orders"
on public.orders
for all
using (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "admin_manage_order_items"
on public.order_items
for all
using (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "admin_manage_products"
on public.admin_products
for all
using (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "admin_manage_notifications"
on public.notifications
for all
using (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);

create policy "site_banners_public_read"
on public.site_banners
for select
using (true);

create policy "admin_manage_site_banners"
on public.site_banners
for all
using (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles as p
    where p.id = auth.uid()
      and p.role = 'admin'
  )
);
