# Highland Sportsman’s Club — MVP (Ready to Upload)

This repo is the assembled code from our chat (schema, functions stubs, Next.js app, and UX polish).  
You can upload this ZIP directly to GitHub using the web UI (no terminal needed).

## Quick start

1) Create a new GitHub repository (empty). Click **"Add file" → "Upload files"** and upload the entire ZIP contents.
2) Create a **Supabase** project and a **Stripe** account.
3) Copy `.env.example` to `.env.local` on your local dev (if you later clone) and fill values.
4) In **Supabase**:
   - Run SQL in `supabase/migrations/000_init.sql` (and add the later changes as you go).
   - Run `supabase/seed.sql`.
   - Deploy functions in `supabase/functions/*` (via Supabase UI or CLI).
   - Set Functions environment variables (see below).
5) Deploy the Next.js app to **Vercel** or run locally.

## Environment variables

### Next (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
SUPABASE_FUNCTIONS_URL= https://<project-ref>.functions.supabase.co
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_MIN_LEAD_MINUTES=1440
```

### Supabase Functions (Project Settings → Functions → Env)
```
SUPABASE_URL= https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_FUNCTIONS_URL= https://<project-ref>.functions.supabase.co
RESEND_API_KEY=
RESEND_FROM= club@yourdomain.com
APP_URL= https://yourapp.vercel.app
STRIPE_SECRET_KEY=
MIN_LEAD_MINUTES=1440
MIN_CANCEL_MINUTES=1440
```

## Notes
- Images are referenced under `/public` (hero banners, guide fallback). You can drop your own photos there.
- For Stripe webhooks in production, set `STRIPE_WEBHOOK_SECRET` in Vercel/Next environment and add the endpoint `/api/stripe/webhook` in Stripe.
- Admins are identified by email list in `ADMIN_EMAILS` (comma-separated). See `.env.example`.