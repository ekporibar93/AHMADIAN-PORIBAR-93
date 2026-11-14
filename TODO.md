# আহমদিয়ান পরিবার-93 — Delivery TODO

## Public Bengali homepage
- [x] The public homepage shows “আহমদিয়ান পরিবার-93”, the taglines “আঁরা বিয়াক্কুন এক পরিবার” and “লক্ষ্য অর্জনে প্রতিজ্ঞাবদ্ধ”, a two-tone brand mark, contact affordances, a hero gallery slider with Bengali captions, previous/next controls, progress indicators, five-second autoplay, and a lightbox preview.
- [x] The public homepage keeps all financial amounts and accounting tables out of the public surface.
- [x] The homepage includes presentation posts, an about/presentation section, sample approved-member cards with name/member ID/photo, mobile/tablet/desktop responsive behavior, and an overlap-free header/rail.

## Demo auth and protected accounting shell
- [x] The login modal supports member ID/email and password fields, Bengali helper/error copy, a demo sign-in path, and redirect to `/hisab` after success.
- [x] `/hisab` is route-gated in the prototype: signed-out visitors see a protected gate; signed-in demo users see a responsive accounting shell with visible sign-out.
- [x] The protected shell includes dashboard overview, deposit ledger preview, expense ledger preview, member sheet preview, monthly/annual/combined report actions, and an Admin-only-looking control surface.
- [x] Demo aggregation labels explicitly identify mock/demo data and preserve the canonical-ledger/no-double-counting concept in the UI.

## Future production integration boundary
- [ ] Read-only audit of the actual Supabase project, schema, Auth users, RLS, RPC/functions, Storage, source routes, and Brevo sender/notification path.
- [ ] Show project ID/region, table/view/function/policy/storage mapping, row counts, discrepancy list, backup/export plan, and additive migration SQL before any production change.
- [ ] Implement server-side/RPC/RLS-backed Auth, onboarding, RBAC, Storage uploads/compression, CMS persistence, Brevo notifications, canonical ledger mutations, and real report/export paths only after approval.

## Quality and handoff
- [x] Route manifest, Netlify SPA fallback, environment template, and print CSS are included.
- [ ] Run `pnpm test`, `pnpm check`, and `pnpm build` after implementation; resolve actionable diagnostics.
- [ ] Perform desktop/mobile visual verification and save a checkpoint after the tested build.
