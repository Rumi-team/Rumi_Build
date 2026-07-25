# Frontend_Rumi_Build — Next.js 15 marketing site (agency offer: "we handle the digital work")

## It has a near-clone twin: `../Frontend_Rumi_AIEmployees`

Same design system, different offer. Identical `"name": "rumi-build"` in package.json,
byte-identical `tailwind.config.ts` and `pnpm-lock.yaml`, same route and component names
(`services/[slug]`, `nav.tsx`, `hero.tsx`, `llms.txt`). Different GitHub org, too:
`Rumi-team/…` here, `rumiai-ai/…` there. **Never port a change between them** — matching
filenames belong to separate sites.

## Nothing local says which domain this deploys to

Every canonical URL here hardcodes `https://rumi.build` (`layout.tsx` metadataBase,
`sitemap.ts` BASE, `robots.ts`, `lib/llms-content.ts`) — but the twin's README claims
`rumi.build` is *its* domain and that this repo serves `rumiai.ai`. There is no `.vercel/`
here to settle it; the twin's `.vercel/project.json` owns the Vercel project named
`rumi-build`. Confirm before changing a canonical URL, and never link this checkout to
that project.
