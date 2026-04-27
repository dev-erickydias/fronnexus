-- ════════════════════════════════════════════════════════════════
--  Fronnexus — Supabase RLS hardening
-- ════════════════════════════════════════════════════════════════
--
-- WHAT THIS DOES
--  Locks down the `contact_submissions` table so anonymous users
--  can ONLY insert (the public can submit a form), not read, update,
--  or delete. Authenticated dashboard sessions (via Service Role
--  in your Supabase Studio) keep full access.
--
-- HOW TO APPLY
--  1. Open https://app.supabase.com/project/<your-project>/sql
--  2. Paste this entire file
--  3. Click "Run"
--  Result: zero rows changed but RLS policies installed
--
-- HOW TO VERIFY
--  1. Run the SELECT at the bottom of this file from a SQL panel
--     authenticated as anon (Supabase Studio default)
--  2. You should see permission denied — that's correct
--  3. Inserting via the API still works (we tested with curl)
--
-- WHY EVERY POLICY IS HERE
--  Defense in depth: even if the anon key is leaked, an attacker
--  can only spam the table — never read, alter, or wipe it.
-- ════════════════════════════════════════════════════════════════

-- ─── Schema (idempotent) ─────────────────────────────────────────
create table if not exists public.contact_submissions (
  id           bigserial primary key,
  created_at   timestamptz not null default now(),
  first_name   text not null,
  last_name    text,
  email        text not null,
  phone        text,
  company      text,
  project_type text,
  budget       text,
  message      text not null,
  ip_hash      text,         -- optional: store sha256 of IP for rate-bucketing analysis
  user_agent   text          -- optional: helps spam triage
);

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

create index if not exists contact_submissions_email_idx
  on public.contact_submissions (email);

-- ─── Enable RLS ──────────────────────────────────────────────────
alter table public.contact_submissions enable row level security;
alter table public.contact_submissions force row level security;

-- ─── Drop any pre-existing permissive policies (clean slate) ─────
drop policy if exists "Allow anon insert" on public.contact_submissions;
drop policy if exists "Allow anon select" on public.contact_submissions;
drop policy if exists "Allow anon update" on public.contact_submissions;
drop policy if exists "Allow anon delete" on public.contact_submissions;
drop policy if exists "Public insert"     on public.contact_submissions;

-- ─── Policy: anon may INSERT, nothing else ────────────────────────
-- The form route uses the NEXT_PUBLIC_SUPABASE_ANON_KEY, which is
-- safe to ship to the client because of THIS policy — it can only
-- write, never read.
create policy "Public insert"
  on public.contact_submissions
  for insert
  to anon, authenticated
  with check (
    -- Server-side cap on payload size as a belt-and-suspenders
    -- fallback to the Node-side validator
    char_length(coalesce(first_name, '')) between 1 and 60
    and char_length(coalesce(email, '')) between 3 and 254
    and char_length(coalesce(message, '')) between 10 and 4000
    and char_length(coalesce(last_name, '')) <= 60
    and char_length(coalesce(phone,    '')) <= 30
    and char_length(coalesce(company,  '')) <= 120
    and char_length(coalesce(project_type, '')) <= 24
    and char_length(coalesce(budget,   '')) <= 24
  );

-- Reading, updating, deleting are NOT granted to anon. The Service
-- Role (in your Supabase Studio dashboard) bypasses RLS entirely,
-- so you can always view leads from the dashboard / SQL editor.

-- ─── Grants (defense in depth) ──────────────────────────────────
revoke all on public.contact_submissions from anon, authenticated;
grant insert on public.contact_submissions to anon, authenticated;

-- ════════════════════════════════════════════════════════════════
--  Optional: rate-limit at the database tier too
-- ════════════════════════════════════════════════════════════════
-- This trigger refuses inserts that exceed 10/hour from the same
-- email address, regardless of which IP/key submitted them.
-- Uncomment if you start seeing email-based spam patterns.

-- create or replace function public.contact_rate_limit()
-- returns trigger language plpgsql as $$
-- declare
--   recent integer;
-- begin
--   select count(*) into recent
--   from public.contact_submissions
--   where lower(email) = lower(new.email)
--     and created_at > now() - interval '1 hour';
--   if recent >= 10 then
--     raise exception 'Rate limit exceeded for this email';
--   end if;
--   return new;
-- end;
-- $$;
--
-- drop trigger if exists contact_rate_limit_trigger on public.contact_submissions;
-- create trigger contact_rate_limit_trigger
-- before insert on public.contact_submissions
-- for each row execute function public.contact_rate_limit();

-- ════════════════════════════════════════════════════════════════
--  Verification queries (run as anon to verify the lockdown)
-- ════════════════════════════════════════════════════════════════
-- Should return permission denied:
-- select * from public.contact_submissions limit 1;
--
-- Should return permission denied:
-- update public.contact_submissions set message = 'pwned' where id = 1;
--
-- Should return permission denied:
-- delete from public.contact_submissions;
--
-- Should succeed:
-- insert into public.contact_submissions
--   (first_name, email, message)
-- values
--   ('Test', 'test@example.com', 'This is a verification message ten characters long.');
