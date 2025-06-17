import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserManager } from 'oidc-client';

function CallbackPage() {
  const [status, setStatus] = useState('Processing...');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('[Client] Processing callback');
    const config = {
      authority: 'http://localhost:4999',
      client_id: 'acmecorp-spa',
      redirect_uri: 'http://localhost:5173/callback',
      response_type: 'code',
      scope: 'openid profile email roles',
      code_challenge_method: 'S256',
      automaticSilentRenew: false,
    };
    const userManager = new UserManager(config);

    userManager.signinRedirectCallback()
      .then(user => {
        console.log('[Client] User authenticated:', user);
        setStatus(`Logged in! User: ${user.profile.email}`);
      })
      .catch(err => {
        console.error('[Client] Callback error:', err);
        setStatus('Login failed');
      });
  }, [location, navigate]);

  return (
    <div>
      <h1>Login Callback</h1>
      <p>{status}</p>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
}

export default CallbackPage;