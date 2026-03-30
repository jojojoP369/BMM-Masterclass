/**
 * Beyond Money Minds - Registration Worker
 * 
 * Deploy this to Cloudflare Workers with a KV namespace bound as "REGISTRATIONS"
 * 
 * Setup steps:
 * 1. Go to Cloudflare Dashboard > Workers & Pages > Create Worker
 * 2. Paste this code
 * 3. Go to Settings > Variables > KV Namespace Bindings
 * 4. Create a KV namespace called "BMM_REGISTRATIONS" 
 * 5. Bind it with variable name "REGISTRATIONS"
 * 6. Update the WORKER_URL in register.html with your worker URL
 */

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const url = new URL(request.url);

    // POST /register - Save a new registration
    if (request.method === 'POST' && url.pathname === '/register') {
      try {
        const { firstName, lastName, email } = await request.json();

        if (!firstName || !lastName || !email) {
          return jsonResponse({ error: 'All fields are required' }, 400);
        }

        // Create registration entry
        const registration = {
          firstName,
          lastName,
          email,
          registeredAt: new Date().toISOString(),
        };

        // Store in KV using email as key (prevents duplicates)
        await env.REGISTRATIONS.put(
          `reg:${email.toLowerCase()}`,
          JSON.stringify(registration)
        );

        // Also maintain a list of all emails for easy export
        const emailList = JSON.parse(await env.REGISTRATIONS.get('email_list') || '[]');
        if (!emailList.includes(email.toLowerCase())) {
          emailList.push(email.toLowerCase());
          await env.REGISTRATIONS.put('email_list', JSON.stringify(emailList));
        }

        return jsonResponse({ success: true, message: 'Registered successfully' });

      } catch (err) {
        return jsonResponse({ error: 'Registration failed' }, 500);
      }
    }

    // GET /registrations - Export all registrations (password protected)
    if (request.method === 'GET' && url.pathname === '/registrations') {
      const password = url.searchParams.get('key');
      
      // CHANGE THIS PASSWORD to something secure
      if (password !== 'bmm2026secret') {
        return jsonResponse({ error: 'Unauthorized' }, 401);
      }

      try {
        const emailList = JSON.parse(await env.REGISTRATIONS.get('email_list') || '[]');
        const registrations = [];

        for (const email of emailList) {
          const data = await env.REGISTRATIONS.get(`reg:${email}`);
          if (data) registrations.push(JSON.parse(data));
        }

        // Return as CSV or JSON based on format param
        const format = url.searchParams.get('format');
        
        if (format === 'csv') {
          const csv = 'First Name,Last Name,Email,Registered At\n' +
            registrations.map(r => 
              `${r.firstName},${r.lastName},${r.email},${r.registeredAt}`
            ).join('\n');
          
          return new Response(csv, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': 'attachment; filename="registrations.csv"',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        return jsonResponse({ total: registrations.length, registrations });

      } catch (err) {
        return jsonResponse({ error: 'Failed to fetch registrations' }, 500);
      }
    }

    return jsonResponse({ error: 'Not found' }, 404);
  },
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
