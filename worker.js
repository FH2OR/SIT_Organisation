export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Endpoint proxy vers Supabase Edge Function
    if (url.pathname === '/wiki-sync' && request.method === 'POST') {
      const resp = await fetch(
        'https://nigumnkmjlazbmobexqx.supabase.co/functions/v1/wikipedia-sync',
        {
          method: 'POST',
          headers: {
            'Content-Type':  'application/json',
            'apikey':        env.SUPABASE_ANON_KEY,
            'Authorization': 'Bearer ' + env.SUPABASE_ANON_KEY,
          },
          body: await request.text(),
        }
      );
      const data = await resp.text();
      return new Response(data, {
        status: resp.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Tout le reste : servir les fichiers statiques
    return env.ASSETS.fetch(request);
  }
};
