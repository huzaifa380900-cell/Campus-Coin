# Campus Coin — NextGen BudgetBee

Campus Coin is a student-first financial platform built with React + Vite + Tailwind CSS, Express, MongoDB Atlas, JWT HttpOnly cookies, Tesseract.js OCR, Gemini with Groq fallback, and Nodemailer. The interface follows the supplied `stitch_campus_coin_expense_tracker` reference system.

## Run locally

1. Copy `server/.env.example` to `server/.env` and configure MongoDB Atlas plus the secrets/integrations you plan to use. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (at least 12 characters); neither value is ever sent to the client.
2. Copy `client/.env.example` to `client/.env`. Add the same Google web client ID if Google sign-in is required. Leave `VITE_API_URL` unset for production builds — the client falls back to the deployed API instead of `localhost`.
3. Run `npm install` in the project root, then `npm run install:all`.
4. Start the client and API together with `npm run dev`.

The client runs at `http://localhost:5173` in development and the API at port `5000`.

## Deployment

The API and the client deploy independently, so the client always calls a cross-origin API and the session cookie runs with `Secure` + `SameSite=None`.

**API (Vercel)** — set the project Root Directory to `server`. `server/vercel.json` rewrites every path to `server/api/index.js`, which exports the Express app and connects to MongoDB on the first request of a cold start. Add the variables from `server/.env.example` as Vercel environment variables, and make sure `CLIENT_URL` contains `https://studentscampuscoin.netlify.app` — the CORS allow-list rejects any other origin.

**Client (Netlify)** — set the Base directory to `client` and the publish directory to `dist`; `client/netlify.toml` supplies the build command, `VITE_API_URL`, and the SPA redirect. `client/public/_redirects` ships inside `dist` as a fallback, so client-side routes such as `/login` return the app shell instead of a hard 404 when a page is reloaded or opened directly.

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
