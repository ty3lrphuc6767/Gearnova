/* GearNova - Supabase client duy nhất cho toàn bộ website */

const SUPABASE_URL = "https://awhimttedtcpwxdoozyl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_bC5tgfQzM01ZhV0c4KrMBA_8jNdhmyM";

if (!window.supabase) {
  console.error("Không tải được Supabase CDN.");
} else {
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
