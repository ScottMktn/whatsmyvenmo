import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (supabaseUrl === "" || supabaseAnonKey === "") {
  throw new Error(`URL or Anon ENV not set for Server - ${supabaseAnonKey}`);
}

export const supabaseClient: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);
