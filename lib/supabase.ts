import { createClient } from '@supabase/supabase-js';

// Use placeholder values at build time when env vars are not yet configured.
// Real requests will fail gracefully (empty data) rather than crashing.
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

export const supabase = createClient(SUPABASE_URL, ANON_KEY);
export const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);
