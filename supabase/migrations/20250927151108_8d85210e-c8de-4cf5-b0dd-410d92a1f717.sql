-- Grant provider role to admin user
with target as (
  select id as user_id
  from auth.users
  where email = 'hussenaemuhumad@gmail.com'
)
insert into public.user_roles (user_id, role)
select user_id, 'provider' from target
on conflict (user_id, role) do nothing;

-- Create provider profile for admin user
with target as (
  select id as user_id
  from auth.users
  where email = 'hussenaemuhumad@gmail.com'
)
insert into public.provider_profiles (user_id)
select user_id from target
on conflict (user_id) do nothing;

-- Create unique indexes if they don't exist
create unique index if not exists user_roles_user_id_role_key
  on public.user_roles (user_id, role);

create unique index if not exists provider_profiles_user_id_key
  on public.provider_profiles (user_id);

-- Verification queries
select 'Admin users:' as info, user_id from public.user_roles where role='admin';
select 'Roles for user fbcc5879-a110-4005-969c-36307d10658e:' as info, role from public.user_roles where user_id='fbcc5879-a110-4005-969c-36307d10658e';
select 'Provider profile exists:' as info, user_id from public.provider_profiles where user_id='fbcc5879-a110-4005-969c-36307d10658e';