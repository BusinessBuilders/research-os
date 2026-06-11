# Deploying the review-fixes branch (fix/review-fixes-quality-sort)

Rollback: the live state before these changes is tagged `rollback/pre-review-fixes-20260610`
(identical to what is running on nova-rig as of 2026-06-10). To roll back:
`git checkout rollback/pre-review-fixes-20260610` and restart both services.

## Required on nova-rig when deploying this branch

1. **Backend `.env`** — add (both optional, safe defaults):
   ```
   # Lock browser access to the frontend origin (recommended; default is *)
   RESEARCHOS_CORS_ORIGINS=http://100.76.233.80:4000
   # Leave empty for llama.cpp (it ignores the model field)
   RESEARCHOS_QWEN_MODEL=
   ```
2. **Frontend** — rebuild required (`npm run build`); `NEXT_PUBLIC_API_URL` is
   build-time inlined, keep `.env.local` as-is.
3. **Database** — no migration needed. New `quality_score` field defaults to null
   on old products; WAL mode and the jobs index are created automatically on startup.
4. **After restart, verify immediately** (bind/CORS changes can silently break access):
   ```
   curl -s http://100.76.233.80:8001/api/health
   # then load http://100.76.233.80:4000 in a browser and open a session
   ```

## Recommended host hardening (not enforced by this branch)

The backend still binds 0.0.0.0, so it listens on ALL interfaces, not just
Tailscale. To make "Tailscale-only" true, either bind to the tailnet IP
(`RESEARCHOS_HOST=100.76.233.80` — then uvicorn must use it; the systemd unit
hardcodes --host) or add a firewall rule:
```
sudo ufw deny in on <lan-iface> to any port 8001
sudo ufw deny in on <lan-iface> to any port 4000
```

## Behavior changes to expect

- Old stuck sessions: jobs left in "searching" are still recovered on startup,
  but a crashed pipeline now marks its job/session "failed" instead of hanging,
  and retries cancel the superseded job — the pile-up of zombie sessions stops growing.
- Research is faster: product-page scrapes now run 5 at a time with a 20s cap
  (previously serial, up to 15×60s per need).
- Products gain community quality stars (1–5, null when no evidence) and the
  results page gets sort (fit/price/quality) + filters (max price, min quality, has price).
