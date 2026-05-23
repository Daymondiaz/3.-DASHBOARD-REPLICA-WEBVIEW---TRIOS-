import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lzpxmvawtfaiujivehhr.supabase.co";

const supabaseAnonKey =
"sb_publishable_zdajWZooM2nZZXhHTnBLjQ_ty9CdDie";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);