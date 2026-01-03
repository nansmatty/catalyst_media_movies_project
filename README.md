# TMDB Movie Explorer (Next.js App Router)

A server-side rendered Movie Explorer application built with **Next.js App Router**, using **The Movie Database (TMDB) API**.  
The project demonstrates SSR, API integration via Route Handlers, caching, error handling, and basic testing.

---

## 🔍 Features

- Movie search with pagination
- Movie detail page with:
  - Overview
  - Runtime
  - Genres
  - Rating
  - Top 5 cast members
  - YouTube trailers
- Server-side rendering for all data-driven pages
- Backend-for-Frontend using Next.js Route Handlers
- Proper caching and rate-limit handling
- Minimal, functional UI (not a design-focused project)

---

## 🧱 Tech Stack

- **Next.js (App Router)**
- **TypeScript**
- **TMDB API (v4 Bearer Token)**
- **Vitest** for testing
- **Tailwind CSS / shadcn-ui** for basic UI components

---

## 📁 Project Structure

```

  src/
  ├── app/
  │ ├── api/
  │ │ ├── movies/
  │ │ │ ├── search/route.ts
  │ │ │ └── [id]/route.ts
  │ │ └── config/route.ts
  │ ├── movie/[id]/page.tsx
  │ └── page.tsx
  ├── components/
  ├── lib/
  │ └── tmdb-config.ts
  tests/

```

---

## 🔐 Environment Variables & Run Project Locally

Create a `.env.local` file in the project root.

````env
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_READ_BEARER_ACCESS_TOKEN=your_tmdb_v4_read_access_token

⚠️ The TMDB token is never exposed to the client.
All TMDB requests are made from Route Handlers only.

A sample file is provided as .env.example.

```bash

npm install
npm run dev

````

Open: 👉 http://localhost:3000

---

## 🧠 Caching Strategy

- Search API (`/api/movies/search`)

  - revalidate: 60 seconds
  - Balances freshness with API rate limits

- Movie details API (`/api/movies/[id]`)

  - revalidate: 60 seconds

- TMDB configuration API (`/api/config`)
  - Cached aggressively (24 hours)
  - Configuration data changes infrequently

This strategy reduces TMDB API calls while keeping data reasonably fresh.

---

## 🧠 Rate Limit Handling

- TMDB may return HTTP 429
- Route Handlers detect 429 responses
- A structured error is returned
- The UI displays a user-friendly message instead of crashing

---

## 🧪 Testing

Minimum required tests are implemented using Vitest.

Run Tests

```bash

npm run test

```

## Included tests

- Route Handler Test
  - Success case for /api/movies/search
  - Failure case when TMDB rate limit (429) is exceeded
- Mocked external dependencies
  - No real TMDB calls during tests
  - All external fetch calls are mocked

These tests provide real signal and validate core backend behavior.

---

## 🌍 Deployment

The application is deployed on Vercel (or Netlify).

- Environment variables are configured securely
- Production build runs successfully
- Public URL is accessible

👉 Deployed URL : https://catalyst-media-tmdb-movie-task.vercel.app/

---

## 📦 Build & Quality Checks

The following commands pass successfully:

```
npm run build
npm run start
npm run test

```

TypeScript compiles without errors.

---

## 🔄 Reflection (Optional)

Trade-off made:
The UI is intentionally minimal to focus on SSR correctness, API design, and production readiness.

Potential improvement:
With more time, additional pagination UX and skeleton loading states could be added.

---

## ✅ Submission Checklist

- Git repository
- Deployed public URL
- .env.example
- README with setup, caching, and testing details
- SSR-compliant implementation
- No client-side TMDB calls
- Secure handling of secrets

---

## Final verdict (straight talk)

At this point you have:

- ✅ All features implemented
- ✅ All strict constraints satisfied
- ✅ Tests passing
- ✅ README compliant with the doc
