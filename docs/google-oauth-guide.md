# Google OAuth (Auth.js) Setup & Backend User Saving Guide

This guide explains how the digital store adds Google sign-in with **Auth.js (NextAuth v5)**
and how OAuth users are **saved into the backend `users` table**.

---

## 1. How it works (flow)

```
[User clicks "Continue with Google"]
        │
        ▼
Auth.js (Next.js) ──redirect──► Google consent screen
        │                                 │ (user approves)
        │◄─────────── profile (email, name) ──┘
        ▼
Auth.js `jwt` callback (Google provider)
        │
        ▼   POST /api/v1/auth/oauth  { email, username, displayName }
Backend AuthService.oauthLogin()
        │
        │  • finds user by email? ──yes──► just log them in (link account)
        │  • no? → CREATE user in `users` table
        │        • username       = email prefix (made unique)
        │        • email          = Google verified email
        │        • passwordHash   = random bcrypt hash (can't log in by password)
        │        • referralCode   = auto-generated
        ▼
        returns { accessToken, user }
        │
        ▼
Stored on the Auth.js JWT session (`token.apiToken`) → exposed via session
        │
        ▼
OAuthSessionSync (client) writes token + profile to localStorage / useAuth()
```

After this, Google users are just like normal users: axios requests carry the same
`Authorization: Bearer <accessToken>`, wallet/orders/roles all work.

---

## 2. Environment variables (frontend `.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
NEXTAUTH_URL=http://localhost:3001
AUTH_SECRET=<generate with: npx auth secret>
AUTH_GOOGLE_ID=<your Google OAuth client id>.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=<your Google OAuth client secret>
```

> Auth.js v5 uses `AUTH_SECRET` (older `NEXTAUTH_SECRET` also works). `NEXTAUTH_URL`
> must be the full public origin of the frontend (e.g. `http://localhost:3001`
> in dev because the backend owns port 3000).

### Create the Google OAuth app
1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth client ID** → type `Web application`.
3. Authorized redirect URI: `{NEXTAUTH_URL}/api/auth/callback/google` (e.g. `http://localhost:3001/api/auth/callback/google`).
4. Authorized JS origins: `{NEXTAUTH_URL}` (e.g. `http://localhost:3001`).
5. Copy the client ID & secret into `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`.

---

## 2. Backend: saving OAuth users to the `users` table

We added a **public** endpoint `POST /api/v1/auth/oauth` (`OAuthDto`)
that upserts the Google profile into the existing `users` Prisma model.

### Backend files changed
- `backend/src/auth/dto/auth.dto.ts` — new `OAuthDto` (`email`, `username`, `displayName?`, `avatarUrl?`).
- `backend/src/auth/auth.service.ts` — new `oauthLogin(dto)`.
- `backend/src/auth/auth.controller.ts` — new `@Public() @Post('auth/oauth')`.

### The upsert logic (`AuthService.oauthLogin`)

```ts
async oauthLogin(dto: OAuthDto) {
  // 1. Existing user (email already on file) → just log them in.
  const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
  if (existing) return this.generateToken(existing);

  // 2. Ensure a unique username when the email prefix is taken.
  let username = dto.username;
  const taken = await this.prisma.user.findUnique({ where: { username } });
  if (taken) username = `${dto.username}_${uuidv4().slice(0, 6)}`;

  // 3. OAuth users have NO usable password — store a random hash so the
  //    account can't be used as a password login. (passwordHash is NOT NULL in schema.)
  const passwordHash = await bcrypt.hash(uuidv4(), 10);
  const referralCode = uuidv4().slice(0, 8).toUpperCase();

  // 4. Persist to the `users` table.
  const user = await this.prisma.user.create({
    data: { username, email: dto.email, passwordHash, referralCode },
  });

  // 5. Return the same JWT shape as register/login.
  return this.generateToken(user);
}
```

### Notes / design decisions
- **`passwordHash` is required** (`String`, not nullable) in your Prisma schema, so we store a
  random bcrypt hash. To make this explicit you could instead make the column nullable and add
  an `oauthProvider` / `providerId` column:

  ```prisma
  model User {
    ...
    passwordHash   String?  @map("password_hash")   // nullable for OAuth-only users
    oauthProvider  String?  @map("oauth_provider")   // e.g. "google"
    oauthAccountId String?  @map("oauth_account_id") // Google sub
  }
  ```
  Then `oauthLogin` can store `passwordHash: null, oauthProvider: 'google', oauthAccountId`.
- **Referral bonus**: currently only created during normal `register`. OAuth create follows the
  same referral-code generation, no bonus linked (no referralCode sent).
- **Roles**: new OAuth users default to `CUSTOMER` (schema default), same as normal signup.
- **Email uniqueness**: the find by email is also what lets an existing email+password account
  "link" to Google on first Google sign-in.

---

## 5. Frontend — Auth.js wiring

New/changed frontend files:

| File | Purpose |
|------|---------|
| `src/auth.ts` | Auth.js config: Google + Credentials providers, `jwt`/`session` callbacks that exchange OAuth → backend JWT |
| `src/app/api/auth/[...nextauth]/route.ts` | Next.js App Router handler (`GET`/`POST`) |
| `src/types/next-auth.d.ts` | Module augmentation for `session.user.apiToken` / `jwt.apiToken` |
| `src/providers/providers.tsx` | Wraps app in `SessionProvider` |
| `src/providers/oauth-session-sync.tsx` | Pushes the backend token + profile into localStorage / `useAuth()` |
| `src/providers/auth-provider.tsx` | `logout()` now also calls NextAuth `signOut()` |
| `src/app/(auth)/login/page.tsx` | "Continue with Google" button |

### Production. Remember to:
- Run `npx auth secret` and put the value in `AUTH_SECRET`.
- Add the real Google ID/secret.
- On deploy, set `NEXTAUTH_URL` to the real domain and add its callback URL to Google CORS.

---

## 6. Optional: protect routes in middleware

If you want server-side route guarding with Auth.js (in addition to the current
client-side `useAuth` gates), create `src/middleware.ts`:

```ts
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  if (!req.auth && !nextUrl.pathname.startsWith("/login")) {
    return Response.redirect(new URL("/login", nextUrl.origin));
  }
});

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
```

The app already gates dashboard/wallet/orders pages via `useAuth()` client-side, so this is optional.