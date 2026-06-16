# Deployment

The production site (`learninghub.usamakelani.com`) runs on a self-hosted homelab
server and is exposed through a **Cloudflare Tunnel**. The server is reachable only
over **Tailscale** (no public inbound), so deployment is **pull-based**: the server
watches GitHub and updates itself. Pushing to `main` is all you need to do.

## How it runs (on the server)

| Thing | Value |
| --- | --- |
| Repo path | `/srv/stacks/learning-hub` |
| App process | systemd **user** service `learning-hub.service` → `next start -H 127.0.0.1 -p 3002` |
| Database | `learning-hub-postgres` Docker container (`127.0.0.1:5432`) |
| Public routing | Cloudflare Tunnel → `http://127.0.0.1:3002` |
| Auto-deploy | systemd **user** timer `learning-hub-deploy.timer` (every 2 min) |

The app service has `Linger=yes`, so it (and the deploy timer) survive reboots and
logouts without anyone being logged in.

## Auto-deploy (already set up)

`~/.local/bin/learning-hub-deploy.sh` runs on a 2-minute timer. Each run:

```
git fetch origin main
# if origin/main moved:
git reset --hard origin/main
npm install --legacy-peer-deps
npx prisma generate
npm run build
systemctl --user restart learning-hub
```

**So: just `git push` to `main`. The site updates within ~2 minutes.**
Cloudflare serves the app HTML as `DYNAMIC` (not edge-cached), so no cache purge is
needed for normal page updates.

## Useful commands (SSH in as the server user)

```bash
# force a deploy right now instead of waiting for the timer
systemctl --user start learning-hub-deploy.service

# watch a deploy happen
journalctl --user -u learning-hub-deploy.service -f

# app service
systemctl --user status learning-hub
systemctl --user restart learning-hub

# timer schedule
systemctl --user list-timers learning-hub-deploy.timer
```

If course content is stored in the database (not the built-in fallback), run
`npm run db:seed` in the repo to refresh seeded courses.

## Manual deploy (fallback)

```bash
cd /srv/stacks/learning-hub
git fetch --all --prune && git reset --hard origin/main
npm install --legacy-peer-deps
npx prisma generate
npm run build
systemctl --user restart learning-hub
```

## Note on GitHub Actions

A GitHub-hosted Actions runner cannot reach this server directly because it lives on
a private Tailscale network. If you ever want push-based CI deploys instead of the
poller, you'd add a `tailscale/github-action` step (with a Tailscale auth key) so the
runner joins the tailnet and can SSH in, or register a self-hosted runner on the
homelab (note the security caveats for self-hosted runners on public repos).
