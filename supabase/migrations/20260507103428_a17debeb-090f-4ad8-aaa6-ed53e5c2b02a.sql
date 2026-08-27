
-- Idempotent test-user seeding for Phase 6.5.5c-b smoke matrix.
-- Wrapped in existence checks: only runs when the smoke-test users actually exist
-- in auth.users. On a fresh production DB (like the Lovable → Vercel migration
-- destination) these rows simply skip; on a smoke-test DB where the seed users
-- have been created, they insert as originally intended.

DO $$
DECLARE
  v_user_t1     uuid := 'c1ab2290-d262-4316-99e6-9d6644e145e7'::uuid;
  v_user_t2     uuid := '41a86d77-f9e1-4592-8705-2183b9b2bd13'::uuid;
  v_user_t3     uuid := '4de895f0-03c8-4cfc-8732-d6c1e8b6983a'::uuid;
  v_user_admin  uuid := '9a0b74fa-4b8c-4ebd-82c2-0e899af46a39'::uuid;
BEGIN
  -- 1. user.t1 gets role:consultant (only if both t1 and admin exist)
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_t1)
     AND EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_admin) THEN
    INSERT INTO public.user_attributes (user_id, key, value, granted_by)
    SELECT v_user_t1, 'role', 'consultant', v_user_admin
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_attributes
      WHERE user_id = v_user_t1 AND key = 'role' AND value = 'consultant'
    );
  END IF;

  -- 2. Ensure user.t2 owns at least one programme (only if t2 exists)
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_t2) THEN
    INSERT INTO public.programmes (name, description, client_org, owner_user_id)
    SELECT 'ABAC test — t2 programme', NULL, NULL, v_user_t2
    WHERE NOT EXISTS (
      SELECT 1 FROM public.programmes WHERE owner_user_id = v_user_t2
    );
  END IF;

  -- 3. Add user.t3 as viewer to admin's earliest programme (needs t3, admin, and a programme)
  IF EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_t3)
     AND EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_admin) THEN
    INSERT INTO public.programme_members (programme_id, user_id, role, invited_by)
    SELECT p.id, v_user_t3, 'viewer', v_user_admin
    FROM public.programmes p
    WHERE p.owner_user_id = v_user_admin
    ORDER BY p.created_at ASC
    LIMIT 1
    ON CONFLICT (programme_id, user_id) DO NOTHING;
  END IF;
END $$;
