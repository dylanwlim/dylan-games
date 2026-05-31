# Deployment

## Production Target

- Vercel project: `dylan-games` (`prj_cgKDdPzQttp7ubHyaBuYRRXVHX0m`)
- Vercel team: `team_bbLoVoshgKMbjGs5UhmJM5kZ`
- Production domain: `games.dylanwlim.com`
- Main site boundary: do not modify or link from `dylanwlim.com`

## Vercel Settings

The checked-in `vercel.json` pins the expected Vercel settings, and Vercel
project inspect currently reports the same values:

- Framework: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Development command: `npm run dev`
- Output directory: `.next`

No environment variables are required for the current app.

## DNS

The production domain is configured in Vercel and Cloudflare with a DNS-only
record:

| Type | Name    | Value         | Proxy    |
| ---- | ------- | ------------- | -------- |
| A    | `games` | `76.76.21.21` | DNS only |

Do not add or change records for the apex `dylanwlim.com` domain for this app.

## Verification

```bash
npm run build
npm run deploy:preview
npm run deploy:production
npm run verify:deployment -- https://games.dylanwlim.com
```

The verification script checks the response, app shell content, noindex
metadata, and robots behavior.

Use this command for the active production deployment id:

```bash
vercel inspect https://games.dylanwlim.com --scope dylans-projects-73251aac
```
