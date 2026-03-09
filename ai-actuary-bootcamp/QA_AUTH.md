# QA Checklist: Google Authentication

## Setup
- [x] Open Firebase Console for `ai-actuary-bootcamp-dev-260308`
- [x] Go to Authentication -> Sign-in method
- [x] Confirm Google is enabled
- [ ] Confirm the app is live at `https://ai-actuary-bootcamp-dev-260308.web.app`
- [ ] Open the site in an incognito window or do a hard refresh with Ctrl+Shift+R

## Happy-path test
- [ ] Navigate to `https://ai-actuary-bootcamp-dev-260308.web.app/login`
- [ ] Confirm you see a button labeled "Continuar com Google"
- [ ] Click it
- [ ] Complete the Google popup with a valid Google account
- [ ] Confirm you are redirected to `/`
- [ ] Refresh the page and confirm you remain signed in
- [ ] Visit a protected route like `/missions/00` or `/portfolio` and confirm you are not bounced back to `/login`

## Logout test
- [ ] Click "Sair" in the header
- [ ] Confirm you return to a signed-out state
- [ ] Visit `/missions/00`
- [ ] Confirm you are redirected to `/login`

## Negative-path test
- [ ] Click "Continuar com Google"
- [ ] Close the popup before finishing
- [ ] Confirm the page shows: "O popup Google foi fechado antes da autenticacao terminar."

## Troubleshooting
- **If the button is missing:**
  - hard refresh again
  - try incognito
  - confirm latest deploy is loaded
- **If clicking Google shows operation-not-allowed:**
  - Google provider is not enabled in Firebase
- **If popup opens then fails:**
  - check Firebase Auth authorized domains include `ai-actuary-bootcamp-dev-260308.web.app`
- **If login succeeds but protected pages still redirect:**
  - inspect browser console
  - confirm Firebase Auth state persists after refresh

## Acceptance criteria
- [ ] Google button is visible on `/login`
- [ ] Popup opens
- [ ] Successful Google auth redirects to `/`
- [ ] Authenticated user can access protected routes
- [ ] Logout returns protected routes to guarded behavior
