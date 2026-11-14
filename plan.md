# সমিতি-নাইন্টি ত্রি — Implementation & Design Plan

## Scope and implementation approach

This first checkpoint is a polished front-end prototype for the requested cooperative management product. It intentionally uses local demo data only: it does not connect to Supabase, Brevo, Storage, Auth, or any production project, and it does not create or mutate financial records. The code is structured so those integrations can be added behind server/RPC boundaries after a read-only production audit and explicit migration approval.

The stack is a single Vite + TypeScript application with route-aware rendering for `/` and `/hisab`. The public experience is a Bengali-first homepage with a five-second RTL gallery, editorial presentation cards, approved-member directory samples, contact affordances, and a login modal. The protected-looking accounting experience is a local demo session with a responsive drawer/sidebar, role-aware admin affordances, ledger previews, member sheet, reporting actions, and print-friendly surfaces. All copy, labels, validation, and demo states are Bengali.

## Project structure

- `src/main.ts` — application state, client-side demo routing, public/home render, auth modal, gallery/lightbox, dashboard interactions.
- `src/style.css` — typography, design tokens, responsive layout, modal, tables, mobile drawer, print rules.
- `public/assets/` — generated gallery imagery referenced via managed storage URLs in the app.
- `public/manus-routes.json` — complete route manifest for `/` and `/hisab`.
- `netlify.toml` — static build and SPA fallback configuration.
- `.env.example` — future browser-safe Supabase/Brevo placeholder names without secrets.
- `TODO.md` — outcome-oriented delivery checklist mapped to the source brief.

## Design direction

Three possible directions were considered:

1. **Heritage editorial — 0.07**: quiet paper, deep teal, saffron accents, serif display type, institutional warmth.
2. **Civic modernist — 0.06**: crisp white, cobalt, modular blocks, direct dashboard language.
3. **Soft family archive — 0.04**: sage, clay, rounded cards, photographic storytelling.

Chosen direction: **Heritage editorial**.

- **Design movement:** Bengali editorial publishing meets a trusted cooperative ledger.
- **Core principles:** calm authority, generous reading rhythm, transparent hierarchy, and human warmth without decorative excess.
- **Color philosophy:** deep teal communicates trust and continuity; saffron is reserved for action and optimism; warm paper keeps the page familiar and print-like; ink and muted moss support legibility.
- **Layout paradigm:** an offset editorial composition: wide left narrative column paired with a floating gallery rail, then asymmetric sections with visible breathing room rather than a dense dashboard grid.
- **Signature elements:** a two-tone “93” seal, saffron hairline rules, and framed image captions that feel like archive notes.
- **Interaction philosophy:** controls are explicit and tactile; state changes use Bengali status copy and modest motion rather than hidden behavior.
- **Animation:** five-second right-to-left gallery transitions, gentle caption fade/slide, 180–240ms button and drawer motion, and no distracting infinite effects.
- **Typography system:** `Noto Serif Bengali` for display headlines and `Noto Sans Bengali` for navigation, labels, tables, and controls. Headlines are compact and high contrast; body copy stays at a comfortable 1.7 line-height.
- **Brand essence:** a shared, respectful financial home for members building toward goals together. Personality: grounded, hopeful, accountable.
- **Brand voice:** direct, familial, and dignified. Example lines: “হিসাব পরিষ্কার, পথ একসাথে।” and “আজকের ছোট্ট শৃঙ্খলাই আগামী দিনের স্বস্তি।”
- **Wordmark & logo:** a compact round seal containing “৯৩” with a small saffron baseline, paired with the stacked Bengali name.
- **Signature brand color:** `#0B4F4A` deep teal.

## Production-readiness boundary

Before real integration, perform the requested read-only audit of the existing Supabase project, Auth users, tables, RPCs, triggers, RLS, Storage, and Brevo sender flow. Preserve the existing admin/member/ledger/site data exactly, document mappings and counts, and show additive SQL before applying anything. No live audit is possible from this sandbox because no production credentials or connection were provided.
