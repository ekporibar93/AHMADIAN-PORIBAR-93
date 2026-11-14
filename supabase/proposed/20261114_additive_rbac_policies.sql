-- PROPOSED ONLY — not applied to production.
-- Apply only after explicit review and confirmation.
-- This migration is additive: it does not drop, truncate, rename, overwrite, or
-- revoke existing tables, rows, storage objects, functions, privileges, or policies.

begin;

create or replace function public.app_user_id()
returns bigint
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
  select u.id
  from public.users as u
  where u."openId" = auth.uid()::text
  limit 1
$$;

create or replace function public.app_role()
returns text
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
  select coalesce(
    (
      select u.role
      from public.users as u
      where u."openId" = auth.uid()::text
      limit 1
    ),
    'anonymous'
  )
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
  select public.app_role() in ('admin', 'moderator')
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public, auth
as $$
  select public.app_role() = 'admin'
$$;

grant execute on function public.app_user_id() to authenticated;
grant execute on function public.app_role() to authenticated;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

create policy additive_cooperative_settings_select_anon
on public."cooperativeSettings"
for select to anon
using (true);

create policy additive_cooperative_settings_select_authenticated
on public."cooperativeSettings"
for select to authenticated
using (true);

create policy additive_cooperative_settings_admin_update
on public."cooperativeSettings"
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy additive_users_select_self_or_staff
on public.users
for select to authenticated
using (
  "openId" = auth.uid()::text
  or public.is_staff()
);

create policy additive_users_admin_update
on public.users
for update to authenticated
using (public.is_admin())
with check (
  public.is_admin()
  and role in ('user', 'member', 'moderator', 'admin')
);

create policy additive_members_select_self_or_staff
on public.members
for select to authenticated
using (
  public.is_staff()
  or "userId" = public.app_user_id()
);

create policy additive_members_admin_insert
on public.members
for insert to authenticated
with check (public.is_admin());

create policy additive_members_admin_update
on public.members
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy additive_members_admin_delete
on public.members
for delete to authenticated
using (public.is_admin());

create policy additive_ledger_select_self_or_staff
on public."ledgerEntries"
for select to authenticated
using (
  public.is_staff()
  or (
    "memberId" is not null
    and exists (
      select 1
      from public.members as m
      where m.id = "ledgerEntries"."memberId"
        and m."userId" = public.app_user_id()
    )
  )
);

create policy additive_ledger_admin_insert
on public."ledgerEntries"
for insert to authenticated
with check (public.is_admin());

create policy additive_ledger_admin_update
on public."ledgerEntries"
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy additive_ledger_admin_delete
on public."ledgerEntries"
for delete to authenticated
using (public.is_admin());

create policy additive_gallery_select_anon
on public."galleryItems"
for select to anon
using (true);

create policy additive_gallery_select_authenticated
on public."galleryItems"
for select to authenticated
using (true);

create policy additive_gallery_admin_insert
on public."galleryItems"
for insert to authenticated
with check (public.is_admin());

create policy additive_gallery_admin_update
on public."galleryItems"
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy additive_gallery_admin_delete
on public."galleryItems"
for delete to authenticated
using (public.is_admin());

create policy additive_notifications_admin_select
on public."notificationEvents"
for select to authenticated
using (public.is_admin());

create policy additive_gallery_storage_admin_select
on storage.objects
for select to authenticated
using (bucket_id = 'cooperative-gallery' and public.is_admin());

create policy additive_gallery_storage_admin_insert
on storage.objects
for insert to authenticated
with check (bucket_id = 'cooperative-gallery' and public.is_admin());

create policy additive_gallery_storage_admin_update
on storage.objects
for update to authenticated
using (bucket_id = 'cooperative-gallery' and public.is_admin())
with check (bucket_id = 'cooperative-gallery' and public.is_admin());

create policy additive_gallery_storage_admin_delete
on storage.objects
for delete to authenticated
using (bucket_id = 'cooperative-gallery' and public.is_admin());

commit;
