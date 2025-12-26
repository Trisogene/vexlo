import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Determine a safe, normalized Supabase URL for local dev:
// - Use `VITE_SUPABASE_URL` when provided
// - If missing, fall back to local Supabase URL
// - If provided without protocol, prepend http://
let supabaseUrl: string;
if (rawSupabaseUrl) {
	const hasProtocol = /^https?:\/\//i.test(rawSupabaseUrl);
	supabaseUrl = hasProtocol ? rawSupabaseUrl : `http://${rawSupabaseUrl}`;
} else {
	supabaseUrl = "http://localhost:54321";
}

if (!supabaseAnonKey) {
	throw new Error("Missing Supabase anon key (VITE_SUPABASE_ANON_KEY)");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
