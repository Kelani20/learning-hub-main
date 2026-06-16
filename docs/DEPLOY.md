# Deployment

The production site (`learninghub.usamakelani.com`) is the Next.js app running on a
personal server and exposed through a **Cloudflare Tunnel**. Pushing to GitHub does
**not** update it on its own — the server must pull, rebuild, and restart.

`.github/workflows/deploy.yml` automates that: on every push to `main` (or a manual
run from the **Actions** tab), GitHub Actions SSHes into the server and runs
pull → install → `prisma generate` → `npm run build` → restart, then optionally
purges the Cloudflare cache.

## One-time setup

### 1. Create an SSH deploy key (on your machine)

```bash
ssh-keygen -t ed25519 -C "learning-hub-deploy" -f ~/.ssh/learning_hub_deploy
# copy the PUBLIC key onto the server:
ssh-copy-id -i ~/.ssh/learning_hub_deploy.pub <user>@<server>
# (or append the .pub contents to ~/.ssh/authorized_keys on the server)
```

### 2. Add GitHub repository secrets

`Settings → Secrets and variables → Actions → New repository secret`:

| Secret | Value |
| --- | --- |
| `SSH_HOST` | server hostname / IP |
| `SSH_USER` | SSH username |
| `SSH_KEY` | contents of the **private** key `~/.ssh/learning_hub_deploy` |
| `DEPLOY_PATH` | absolute path to the repo on the server, e.g. `/home/<user>/learning-hub-main` |
| `SSH_PORT` | *(optional)* SSH port, defaults to `22` |
| `CF_ZONE_ID` | *(optional)* Cloudflare Zone ID — enables cache purge |
| `CF_API_TOKEN` | *(optional)* Cloudflare token with **Cache Purge** permission |

Optional **variable** (same screen → Variables tab): `DEPLOY_RESTART` — the restart
command, defaulting to `pm2 restart learning-hub`. Set it to match how the app runs,
e.g. `pm2 restart 0`, `sudo systemctl restart learning-hub`, or
`docker compose up -d --build`.

### 3. Deploy

- Trigger immediately: **Actions → Deploy to production → Run workflow**.
- Or just `git push` to `main` from then on.

## Manual deploy (fallback)

```bash
ssh <user>@<server>
cd <DEPLOY_PATH>
git fetch --all --prune && git reset --hard origin/main
npm install --legacy-peer-deps
npx prisma generate
npm run build
pm2 restart learning-hub   # or your restart command
```

If course content lives in a real database on the server, run `npm run db:seed` to
load the latest seeded courses. After deploying, purge the Cloudflare cache
(dashboard → Caching → Purge Everything) if you don't use the automated purge.
