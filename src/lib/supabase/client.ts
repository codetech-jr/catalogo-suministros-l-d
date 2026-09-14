import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kamjsoixfywsdgdqmwno.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbWpzb2l4Znl3c2RnZHFtd25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxOTM0NDgsImV4cCI6MjA5Nzc2OTQ0OH0.rrpxshEGyCLOMiscq6v-dNJkU_jDG6-ydy0OFsWl19I";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
