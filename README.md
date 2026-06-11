# Dylan Games

Premium browser-games hub for [games.dylanwlim.com](https://games.dylanwlim.com).

This repository is intentionally separate from `dylanwlim.com`. The portfolio
site links to the launched public hub at `games.dylanwlim.com`; keep broader
homepage launch copy out of the main personal site unless that site is updated
in the same pass.

## Stack

- Next.js App Router
- TypeScript
- Motion for restrained UI transitions
- Vitest for simulation/unit coverage
- Playwright for smoke and responsive checks
- Vercel for preview and production deploys

## Local Development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

Playable game routes are gated by DWL Accounts. Use `.env.example` for the required
Accounts routing variables and server-only `DWL_APP_SECRET` when testing signed
in play locally.

## Validation

```bash
npm run validate
```

The validation suite runs formatting, linting, type checking, unit tests, a
production build, and Playwright smoke tests.

## Deployment

Production target: `games.dylanwlim.com`.

```bash
npm run deploy:preview
npm run deploy:production
npm run verify:deployment -- https://games.dylanwlim.com
```

See [docs/deployment.md](docs/deployment.md) for Vercel and DNS details.
