// Supabase client for the NEXUS frontend.
// Post-migration: uses standard localStorage for auth persistence.
// The old Lovable-specific `brokeredPreviewStorage()` was removed as part of the
// Vercel migration — it was only needed for Lovable's preview iframe.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // Uses browser localStorage by default — safe for standard SPA deployment.
  }
});
