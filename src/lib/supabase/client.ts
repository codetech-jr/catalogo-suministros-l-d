import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Faltan variables de entorno de Supabase. La persistencia remota no funcionará.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
