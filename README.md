# Campus Coin — NextGen BudgetBee

Campus Coin is a student-first financial platform built with React + Vite + Tailwind CSS, Express, MongoDB Atlas, JWT HttpOnly cookies, Tesseract.js OCR, Gemini with Groq fallback, and Nodemailer. The interface follows the supplied `stitch_campus_coin_expense_tracker` reference system.

## Run locally

1. Copy `server/.env.example` to `server/.env` and configure MongoDB Atlas plus the secrets/integrations you plan to use. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (at least 12 characters); neither value is ever sent to the client.
2. Copy `client/.env.example` to `client/.env`. Add the same Google web client ID if Google sign-in is required. Leave `VITE_API_URL` unset for production builds — the client falls back to the deployed API instead of `localhost`.
3. Run `npm install` in the project root, then `npm run install:all`.
4. Start the client and API together with `npm run dev`.

The client runs at `http://localhost:5173` in development and the API at port `5000`.

## Deployment

This folder is the development workspace. Each side is published to its own GitHub repository with `git subtree split`, so a remote receives its subtree as the repository root — which is what both Vercel projects expect with Root Directory `/`.

| Local path | Repository | Vercel project | URL |
| --- | --- | --- | --- |
| `server/` | `faisalmehood15261-wq/CampusCoin` | API | `campus-coin-omega.vercel.app` |
| `client/` | `faisalmehood15261-wq/CampusCoin-client` | Client | `campus-coin-client.vercel.app` |

Publish both, or one of them:

```bash
npm run deploy            # both
npm run deploy:server     # API only
npm run deploy:client     # client only
```

The first publish against a repository that already has unrelated history needs `-Force` once: `.\scripts\publish.ps1 -Target all -Force`.

**API.** `server/vercel.json` rewrites every path to `server/api/index.js`, which exports the Express app and connects to MongoDB on the first request of a cold start. Secrets (MongoDB URI, JWT secrets, SMTP, Google client secret, AI keys) belong in the Vercel project's environment variables; `CLIENT_URL` and `NODE_ENV` are already supplied in `vercel.json` and are not secret.

**Client.** `client/vercel.json` sets the Vite build, the output directory, the `VITE_*` values, and a catch-all rewrite to `/index.html` so client-side routes such as `/login` return the app shell instead of a hard 404. `client/netlify.toml` and `client/public/_redirects` provide the same behaviour if the client is also published to Netlify.

No `.env` file is committed. The client build reads `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` from `client/vercel.json`, which is why an earlier deployment silently shipped a `localhost` API address and a disabled Google button.

**Why the cookie is cross-site safe.** The client and the API sit on different subdomains, so the session cookie is issued `Secure; SameSite=None` and sent with `withCredentials`. `server/src/utils/auth.js` derives those flags from `x-forwarded-proto`/`req.secure` rather than `NODE_ENV`, so an HTTPS deployment always gets a usable cross-site cookie while plain-HTTP localhost development keeps `SameSite=Lax`. The API also maintains a CORS allow-list, because `SameSite=None` means any allowed origin can send authenticated requests — `*.vercel.app` is deliberately never wildcarded. Outbound links such as password resets use `publicAppUrl()` instead, since `CLIENT_URL` is a list and only its first entry is a usable origin.

## Administrator provisioning

The API safely provisions the configured administrator after it connects to MongoDB Atlas. It creates the account only when the configured email is missing, hashes the password with bcrypt, and leaves an existing password unchanged. To provision it explicitly, run:

```bash
npm run create-admin --prefix server
```

Administrators sign in at `/admin/login`. This endpoint rejects student accounts, while all `/api/admin/*` routes require the verified session and the database-backed `admin` role.

## Security and ownership

- Session JWTs are issued only in the `campus_coin_session` HTTP-only cookie. They are not written to browser storage.
- Every student query uses the user identity from a verified JWT—not a frontend-supplied user id.
- Google ID tokens are verified server-side with `google-auth-library`.
- The production cookie uses `Secure` and `SameSite=None`; development uses `SameSite=Lax` for localhost.
- API middleware includes Helmet, CORS credentials, rate limiting, password hashing, safe errors, and in-memory constrained uploads.

## Required integrations

MongoDB Atlas is essential. Configure `GEMINI_API_KEY` and `GROQ_API_KEY` in `server/.env` for AI features. Gemini is tried first; Groq is used when Gemini is unavailable or rate-limited. `GROQ_MODEL` is optional and defaults to `openai/gpt-oss-120b`. If both AI providers are unavailable, features with a local rule-based fallback continue to use only the student's saved data. Google sign-in and SMTP also require their server-only environment variables.
