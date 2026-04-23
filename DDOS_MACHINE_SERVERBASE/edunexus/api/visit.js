import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  // Vercel always puts the real IP here
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.headers["x-real-ip"] ||
    "unknown";

  const path = req.headers["referer"] || "/";

  const { error } = await supabase.from("request_log").insert({
    ip:          ip,
    path:        path,
    method:      "GET",
    blocked:     false,
    status_code: 200,
  });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, ip });
}