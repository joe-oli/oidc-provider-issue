# OIDC Example

A minimal example demonstrating an OIDC provider and SPA client using `oidc-provider` and React, managed with `npm`.

## Structure
- `server`: OIDC provider using `oidc-provider@9.1.3`.
- `client`: React SPA with Vite and `oidc-client`.
 
## Setup
1. Install server dependencies:
   ```bash
   cd server
   npm install
   ```
2. Install client dependencies:
   ```bash
   cd ../client
   npm install
   ```
3. Start the server:
   ```bash
   cd ../server
   npm start
   ```
4. In a new terminal, start the client:
   ```bash
   cd ../client
   npm run dev
   ```

## TEST
   - Navigate to `http://localhost:5173`. (use Igcognito or Private window in Browser)
   - Click "Login"; you are redirected to the oidc provider page.
   - Enter `user1@acmecorp.com`, `Password123!`.
   - Expect redirect back to `http://localhost:5173/callback` with message like `Logged in! User: user1@acmecorp.com`.

## FAIL bigtime !!
My minimal OIDC setup, using a custom login page with separate client and server directories, fails with an 'invalid_request: authorization request has expired' error due to a consent loop in oidc-provider@9.1.3. I need guidance to make this basic scenario work within my existing structure, or confirmation that oidc-provider does not support this standard use case. 

Solutions deviating from my structure (e.g., altering the client/server separation, removing the custom login page) are not acceptable, as the setup is straightforward and should be supported.

## TEST RESULTS / Actual Behavior
- Browser error at http://localhost:4999/auth/:uid:
```text
oops! something went wrong
error: invalid_request
error_description: authorization request has expired
iss: http://localhost:4999
```

- HTTP: 400 Bad Request.

- Server logs
[OIDC] POST login received { uid: 'Ui5O6DpcvgSPgp-O0D8KYq-ULf-3zxDq5v4GiUdhm-N', email: 'user1@acmecorp.com' }
[OIDC] Completing interaction with result: { ... }
[OIDC] Login + consent flow completed
[OIDC] Finding account for ID: user1

[OIDC] Interaction details: {
  uid: '4mQBMw5a7U4T_JGeib8CdUJJbA7Vqvcbzr0m0h2DU-2',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: 4mQBMw5a7U4T_JGeib8CdUJJbA7Vqvcbzr0m0h2DU-2
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'vDgcHaWY8QoTLZ__-oaUfLS4YbTivJrGtcBCqRHLRxB',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: vDgcHaWY8QoTLZ__-oaUfLS4YbTivJrGtcBCqRHLRxB
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'sct-OPsn0zfwWdvs5HFqej6MgqxSLquVrTegoKICwNA',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: sct-OPsn0zfwWdvs5HFqej6MgqxSLquVrTegoKICwNA
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'hpDU_u24ACn_tdjRAUeA7W4anBFGilWf2rKNXuD_9g7',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: hpDU_u24ACn_tdjRAUeA7W4anBFGilWf2rKNXuD_9g7
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'l6ICtkEq46DSMCX19t7a4_IMeYb5rAtW-HJvgG9f2B1',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: l6ICtkEq46DSMCX19t7a4_IMeYb5rAtW-HJvgG9f2B1
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'GSJuqr3GTKqI_bWDlLFmVXR4-QUVxAsY6LMcyErpNut',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: GSJuqr3GTKqI_bWDlLFmVXR4-QUVxAsY6LMcyErpNut
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'd9IKcvRwv_Y6VAXDpL_ICHnx0OIlvRBpFfa4WMvxeQO',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: d9IKcvRwv_Y6VAXDpL_ICHnx0OIlvRBpFfa4WMvxeQO
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'qnOgpQLZLFE6bsZD1TxItJc5K-MwGcTZpWZyS1wS3rr',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: qnOgpQLZLFE6bsZD1TxItJc5K-MwGcTZpWZyS1wS3rr
[OIDC] Finding account for ID: user1
[OIDC] Interaction details: {
  uid: 'AEUijAbFIAeYbvO99BLhzrYH40al_Vsq6NkgSgBbBo9',
  prompt: 'consent',
  sessionId: '6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q'
}
[OIDC] Auto-granting consent for UID: AEUijAbFIAeYbvO99BLhzrYH40al_Vsq6NkgSgBbBo9
[OIDC] Finding account for ID: user1
oidc-provider NOTICE: default renderError function called, you SHOULD change it in order to customize the look of the error page.


- Consistent sessionId (6JwcXB3GW0PYf_hkpmW7W3cmyqhuxHxPKkmVXKNuy_q) but changing uid indicates a session state issue.
