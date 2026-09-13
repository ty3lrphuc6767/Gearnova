/* =========================================================
   GEARNOVA - SUPABASE CLIENT
========================================================= */


/*
    LẤY 2 GIÁ TRỊ NÀY TỪ SUPABASE DASHBOARD

    Project URL:
    https://xxxx.supabase.co

    Publishable Key:
    sb_publishable_xxxxxxxxx...
*/


const SUPABASE_URL =
    "https://YOUR_PROJECT_ID.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "YOUR_PUBLISHABLE_KEY";


/*
    CDN đã tạo window.supabase
    Ta tạo client riêng tên window.sb
*/

window.sb =
    window.supabase.createClient(
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