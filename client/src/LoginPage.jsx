import { useEffect, useState } from 'react';
import { UserManager } from 'oidc-client';

function LoginPage() {
  const [userManager, setUserManager] = useState(null);

  useEffect(() => {
    console.log('[Client] Initializing OIDC client');
    const config = {
      authority: 'http://localhost:4999',
      client_id: 'acmecorp-spa',
      redirect_uri: 'http://localhost:5173/callback',
      response_type: 'code',
      scope: 'openid profile email roles',
      code_challenge_method: 'S256',
      automaticSilentRenew: false,
    };
    const manager = new UserManager(config);
    setUserManager(manager);
    console.log('[Client] OIDC client initialized');
  }, []);

  const handleLogin = async () => {
    if (!userManager) {
      console.warn('[Client] UserManager not initialized');
      return;
    }
    console.log('[Client] Initiating login');
    try {
      await userManager.signinRedirect();
    } catch (err) {
      console.error('[Client] Login error:', err);
    }
  };

  return (
    <div>
      <h1>AcmeCorp Login</h1>
      <button onClick={handleLogin} disabled={!userManager}>Login</button>
    </div>
  );
}

export default LoginPage;