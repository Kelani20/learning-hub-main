# Deployment

Learning Hub can run on any Node.js host with a PostgreSQL database. Keep
environment-specific hostnames, account names, network topology, service names,
and credentials in private operational documentation rather than this repository.

## Production checklist

1. Install dependencies with `npm install --legacy-peer-deps`.
2. Set the variables documented in `.env.example` using the hosting provider's
   encrypted secret store.
3. Set `DATABASE_URL` to a production PostgreSQL connection string.
4. Run `npm run db:generate` and apply the appropriate Prisma schema changes.
5. Build with `npm run build` and start with `npm run start`.
6. Put the application behind HTTPS and restrict database access to the app host.

Optional integrations such as Stripe, Mux, Supabase, UploadThing, Sentry, and
PostHog remain disabled until their corresponding environment variables are set.
Never expose server-side keys through variables prefixed with `NEXT_PUBLIC_`.

## Automation

Use a deployment platform or CI system that supports encrypted secrets and
environment protection. A typical deployment should:

```text
install dependencies -> generate the Prisma client -> run verification -> build -> deploy
```

Do not commit generated `.env` files, service credentials, SSH keys, tunnel
configuration, or internal infrastructure details.
