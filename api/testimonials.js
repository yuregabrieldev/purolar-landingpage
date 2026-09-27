const SUPABASE_URL = process.env.PUROLAR_SUPABASE_URL || 'https://iexionzhuymetllkwgkv.supabase.co';
const SUPABASE_KEY = process.env.PUROLAR_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleGlvbnpodXltZXRsbGt3Z2t2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwOTU4NDgsImV4cCI6MjEwNTY3MTg0OH0.Nv5yWm2ghH7CGgziJXtWYaOQK1Etdu3K08Oiocgezg8';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!SUPABASE_KEY) {
    return res.status(500).json({ error: 'Supabase is not configured.' });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/purolar_testimonials?select=id,quote,service,author_name,location&is_published=eq.true&order=display_order.asc,created_at.asc&limit=6`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      console.error('Supabase testimonials error:', response.status, await response.text());
      return res.status(502).json({ error: 'Não foi possível carregar as avaliações.' });
    }

    const items = await response.json();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json({ items });
  } catch (error) {
    console.error('Testimonials request failed:', error);
    return res.status(502).json({ error: 'Não foi possível carregar as avaliações.' });
  }
}
