# Shwe Family Digital Store — Frontend

A modern, mobile-first digital game top-up and product store built with **Next.js 15**, **React 19**, and **TypeScript**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15.5 (App Router) |
| UI | React 19, Tailwind CSS v4, Radix UI (Shadcn) |
| Auth | Auth.js v5 (Google OAuth + Credentials) |
| State | React Context + localStorage |
| Animation | motion.dev (Framer Motion successor) |
| HTTP | Axios (client), fetch (SSR) |
| Language | TypeScript 5 (strict mode) |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (port 3001)
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
API_URL=http://localhost:3000/api/v1

# Auth.js
NEXTAUTH_URL=http://localhost:3001
AUTH_SECRET=your-secret-here

# Google OAuth (optional)
AUTH_GOOGLE_ID=your-client-id
AUTH_GOOGLE_SECRET=your-client-secret
```

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Auth route group (login, register)
│   ├── (dashboard)/              # User dashboard (orders, wallet, profile)
│   ├── (admin)/admin/            # Admin panel
│   ├── games/                    # Public game catalog + detail (SSR)
│   ├── digital-products/         # Public digital products (SSR)
│   └── api/auth/[...nextauth]/   # Auth.js API route
├── components/                   # Shared UI components
│   ├── layout/                   # Header, Sidebar, MobileNav
│   ├── motion/                   # FadeIn, Stagger animations
│   └── ui/                       # Shadcn/Radix primitives
├── lib/                          # Utilities and API layer
│   ├── api/                      # Typed API modules (auth, games, orders, wallet, settings, admin)
│   ├── constants.ts              # Shared constants (categories, status variants)
│   ├── utils.ts                  # cn(), formatMmk(), formatDate(), errorMessage()
│   ├── api-client.ts             # Axios instance with auth interceptors
│   └── server.ts                 # Server-side fetch wrapper (SSR)
├── actions/                      # Server Actions for SSR data fetching
├── hooks/                        # Custom React hooks
├── providers/                    # Context providers (auth, OAuth, root)
├── types/                        # TypeScript type definitions
└── auth.ts                       # NextAuth configuration
```

## Architecture

### Authentication

Dual auth system:
- **JWT-based** — `auth-provider.tsx` manages tokens in localStorage
- **OAuth** — `oauth-session-sync.tsx` bridges NextAuth sessions into the JWT flow
- Google sign-in exchanges OAuth code for backend JWT via `POST /auth/oauth`

### Data Fetching

- **Server Components** — `src/actions/public.ts` fetches public data (games, banners, products) via `serverFetch` on the server (SSR with ISR `revalidate=60`)
- **Client Components** — `src/lib/api/*` modules use `apiClient` (Axios) with Bearer token for authenticated requests

### API Layer

All HTTP calls go through typed modules in `src/lib/api/`:

| Module | Endpoints |
|--------|-----------|
| `auth.ts` | register, login, getProfile, changePassword, getReferralInfo |
| `games.ts` | CRUD for games, packages, digital products, image upload |
| `orders.ts` | User/admin orders, digital orders, reviews |
| `wallet.ts` | Balance, transactions, deposits, coupons |
| `settings.ts` | Banners, notices, payment settings, admin stats |
| `admin.ts` | User management (list, role changes) |

### Shared Code

| File | Exports |
|------|---------|
| `lib/constants.ts` | `categoryLabels`, `categoryColors`, `statusVariant()`, `allCategories` |
| `lib/utils.ts` | `cn()`, `formatMmk()`, `formatDate()`, `errorMessage()`, `resolveImageUrl()` |
| `components/google-icon.tsx` | `GoogleIcon` |
| `components/copy-button.tsx` | `CopyButton`, `copyToClipboard()` |
| `components/image-upload.tsx` | `ImageUpload` (file select + preview, optional auto-upload) |

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | Public | Home — hero, trending games, banners, CTA |
| `/games` | Public | Game catalog with search + category filters (SSR) |
| `/games/[id]` | Public | Game detail + package selection + order form (SSR) |
| `/digital-products` | Public | Digital product cards (SSR) |
| `/login` | Guest | Email/password + Google sign-in |
| `/register` | Guest | Account creation + referral code |
| `/` (dashboard) | User | Dashboard with stats, popular games, recent orders |
| `/orders` | User | Order history with rating system |
| `/wallet` | User | Balance, deposit, coupon redemption, transaction history |
| `/profile` | User | Account info, referral program, password change |
| `/admin` | Admin | Admin dashboard with stats |
| `/admin/games` | Admin | Game/package CRUD with image upload |
| `/admin/digital-products` | Admin | Digital product CRUD |
| `/admin/orders` | Admin | Game order management (deliver/cancel/delete) |
| `/admin/digital-orders` | Admin | Digital order management |
| `/admin/banners` | Admin | Promotional banner management |
| `/admin/topups` | Admin | Deposit approval with optional reward |
| `/admin/coupons` | Admin | Coupon generation |
| `/admin/users` | Admin | User role management |
| `/admin/settings` | Admin | Payment settings, notices, exchange rate |

## Key Features

- **Server-side rendering** — Public pages (home, games, digital products) render on the server for SEO and fast first paint
- **Mobile-first design** — Floating pill navigation, responsive grids, touch-friendly interactions
- **Motion animations** — Spring hover effects, staggered list animations, fade-in transitions
- **Category system** — 6 game categories with color-coded gradients and filter pills
- **Image handling** — Backend file uploads with preview, resolved URLs for uploaded assets
- **Error handling** — Centralized `errorMessage()` extracts server error messages from Axios responses

## Quality Metrics

| Metric | Status |
|--------|--------|
| TypeScript strict mode | Enabled |
| `any` types | 0 |
| `console.log`/`console.error` | 0 |
| ESLint | Clean (pre-existing `<img>` warnings only) |
| Duplicate code | Eliminated across all shared patterns |
| Direct API bypass | 0 (all calls go through `lib/api/` modules) |
| Total files | 81 |
| Total lines | ~6,100 |

## License

Private — Shwe Family Digital Store
