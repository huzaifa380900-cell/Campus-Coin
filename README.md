# Campus Coin — NextGen BudgetBee

Campus Coin is a student-first financial platform built with React + Vite + Tailwind CSS, Express, MongoDB Atlas, JWT HttpOnly cookies, Tesseract.js OCR, Gemini with Groq fallback, and Nodemailer. The interface follows the supplied `stitch_campus_coin_expense_tracker` reference system.

## Run locally

1. Copy `server/.env.example` to `server/.env` and configure MongoDB Atlas plus the secrets/integrations you plan to use. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (at least 12 characters); neither value is ever sent to the client.
2. Copy `client/.env.example` to `client/.env`. Add the same Google web client ID if Google sign-in is required. Leave `VITE_API_URL` unset for production builds — the client falls back to the deployed API instead of `localhost`.
3. Run `npm install` in the project root, then `npm run install:all`.
4. Start the client and API together with `npm run dev`.

The client runs at `http://localhost:5173` in development and the API at port `5000`.

## Deployment

Both projects live on Vercel and are connected to the same Git repository, so a single `git push` rebuilds and redeploys each one from its own root directory.

- **API** — `campus-coin-omega.vercel.app`, project Root Directory `server`
- **Client** — `campus-coin-client.vercel.app`, project Root Directory `client`

**API.** `server/vercel.json` rewrites every path to `server/api/index.js`, which exports the Express app and connects to MongoDB on the first request of a cold start. Secrets belong in the project's Vercel environment variables (see `server/.env.example`); `CLIENT_URL` and `NODE_ENV` are already provided in `vercel.json` and are not secret.

**Client.** `client/vercel.json` sets the Vite build, the output directory, the `VITE_*` values, and a catch-all rewrite to `/index.html` so client-side routes such as `/login` return the app shell instead of a hard 404. `client/netlify.toml` and `client/public/_redirects` provide the same behaviour if the client is also published to Netlify.

**Why the cookie is cross-site safe.** The client and the API are on different subdomains, so the session cookie is issued `Secure; SameSite=None` and sent with `withCredentials`. `server/src/utils/auth.js` derives those flags from `x-forwarded-proto`/`req.secure` rather than `NODE_ENV`, so an HTTPS deployment always gets a usable cross-site cookie while plain-HTTP localhost development keeps `SameSite=Lax`. The API also maintains a CORS allow-list, because `SameSite=None` means any allowed origin can send authenticated requests — `*.vercel.app` is deliberately never wildcarded.

Never set `VITE_API_URL` to a `localhost` address in a production build: it is compiled into the bundle and every visitor would then request their own machine.

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
