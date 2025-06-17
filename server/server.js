import express from 'express';
import { Provider } from 'oidc-provider';

const app = express();
app.use(express.urlencoded({ extended: true }));

const users = {
  'user1@acmecorp.com': {
    accountId: 'user1',
    password: 'Password123!',
    email: 'user1@acmecorp.com',
    profile: { name: 'Acme User' },
    roles: ['employee'],
  },
};

const configuration = {
  clients: [
    {
      client_id: 'acmecorp-spa',
      redirect_uris: ['http://localhost:5173/callback'],
      response_types: ['code'],
      grant_types: ['authorization_code'],
      token_endpoint_auth_method: 'none', // PKCE
      scope: 'openid profile email roles',
      application_type: 'web',
    },
  ],
  features: {
    devInteractions: { enabled: false }, // Custom interaction routes
    clientCredentials: { enabled: false },
    introspection: { enabled: false },
    revocation: { enabled: false },
  },
  ttl: {
    Interaction: 7200, // 2 hours
    Session: 2592000, // 30 days
  },
  claims: {
    openid: ['sub'],
    email: ['email'],
    profile: ['name'],
    roles: ['roles'],
  },
  routes: {
    authorization: '/auth',
    token: '/token',
    userinfo: '/userinfo',
    jwks: '/jwks',
  },
  interactions: {
    url(ctx, interaction) {
      return `/interaction/${interaction.uid}`;
    },
  },
  findAccount: async (ctx, id) => {
    console.log('[OIDC] Finding account for ID:', id);
    const user = Object.values(users).find(u => u.accountId === id);
    if (!user) {
      console.warn('[OIDC] Account not found for ID:', id);
      return undefined;
    }
    return {
      accountId: id,
      async claims() {
        console.log('[OIDC] Returning claims for account:', id);
        return {
          sub: id,
          email: user.email,
          name: user.profile.name,
          roles: user.roles,
        };
      },
    };
  },
  cookies: {
    long: { sameSite: 'Lax', httpOnly: true },
    short: { sameSite: 'Lax', httpOnly: true },
  },
};

const oidc = new Provider('http://localhost:4999', configuration);

// Custom error rendering
oidc.on('server_error', (ctx, err) => {
  console.error('[OIDC] Server error:', err);
  ctx.status = err.statusCode || 500;
  ctx.body = `Error: ${err.message}`;
});

app.get('/interaction/:uid', async (req, res, next) => {
  try {
    const details = await oidc.interactionDetails(req, res);
    const { uid, prompt, session } = details;
    const error = req.query.error || '';

    console.log('[OIDC] Interaction details:', { uid, prompt: prompt.name, sessionId: session?.uid });

    if (prompt.name === 'consent') {
      console.log('[OIDC] Auto-granting consent for UID:', uid);
      const result = {
        consent: {
          rejectedScopes: [],
          rejectedClaims: [],
          scope: details.params.scope || 'openid profile email roles',
        },
      };
      await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
      return;
    }

    if (prompt.name !== 'login') {
      console.warn('[OIDC] Unexpected prompt:', prompt.name, 'UID:', uid);
      return res.status(400).send(`Invalid interaction prompt: ${prompt.name}`);
    }

    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>AcmeCorp OIDC Login</title></head>
        <body>
          <h1>Login to AcmeCorp</h1>
          ${error ? `<p style="color: red;">${error}</p>` : ''}
          <form method="POST" action="/interaction/${uid}/login">
            <label>Email: <input name="email" type="email" required /></label><br />
            <label>Password: <input type="password" name="password" required /></label><br /><br />
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `);
  } catch (err) {
    console.error('[OIDC] Interaction error:', err);
    next(err);
  }
});

app.post('/interaction/:uid/login', async (req, res, next) => {
  try {
    const { uid } = req.params;
    const { email, password } = req.body;

    console.log('[OIDC] POST login received', { uid, email });

    const user = users[email];

    if (!user || user.password !== password) {
      console.warn(`[OIDC] Invalid login: ${email}`);
      return res.redirect(`/interaction/${uid}?error=Invalid%20credentials`);
    }

    const details = await oidc.interactionDetails(req, res);
    const { params, session } = details;

    console.log('[OIDC] Login interaction details:', { sessionId: session?.uid });

    const result = {
      login: {
        accountId: user.accountId,
        acr: 'urn:mace:incommon:iap:bronze',
        amr: ['pwd'],
        ts: Math.floor(Date.now() / 1000),
      },
      consent: {
        rejectedScopes: [],
        rejectedClaims: [],
        scope: params.scope || 'openid profile email roles',
      },
    };

    console.log('[OIDC] Completing interaction with result:', result);
    await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
    console.log('[OIDC] Login + consent flow completed');
  } catch (err) {
    console.error('[OIDC] Login interaction error:', err);
    next(err);
  }
});

app.use('/', oidc.callback());

app.listen(4999, () => {
  console.log('Mock OIDC provider running at http://localhost:4999/.well-known/openid-configuration');
});
