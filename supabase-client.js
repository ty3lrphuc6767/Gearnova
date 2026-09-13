/* =========================================================
   GEARNOVA - SUPABASE CLIENT
========================================================= */

const SUPABASE_URL =
  "https://awhimttedtcpwxdoozyl.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_bC5tgfQzM01ZhV0c4KrMBA_8jNdhmyM";


/* =========================================================
   KIỂM TRA CDN
========================================================= */

if (!window.supabase) {
  throw new Error(
    "Không tải được Supabase CDN. Hãy kiểm tra thứ tự script trong HTML."
  );
}


/* =========================================================
   TẠO SUPABASE CLIENT DUY NHẤT
========================================================= */

window.sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

console.log("Supabase client đã sẵn sàng:", window.sb);