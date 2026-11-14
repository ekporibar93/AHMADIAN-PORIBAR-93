# সমিতি-নাইন্টি ত্রি — সেটআপ গাইড

এই রেপোজিটরির বর্তমান সংস্করণটি একটি নিরাপদ front-end prototype। এটি Vite + TypeScript দিয়ে তৈরি, `/`-এ public homepage এবং `/hisab`-এ protected accounting shell দেখায়। ডেমো login-এর জন্য যেকোনো সদস্য ID/email এবং কমপক্ষে ৬ অক্ষরের password ব্যবহার করা যায়। সফল login-এর পর session state browser `sessionStorage`-এ রাখা হয়; এটি production authentication নয়।

## চালানো

```bash
pnpm install
pnpm dev
```

Production build যাচাই করতে:

```bash
pnpm test
pnpm check
pnpm build
```

Netlify build command হলো `pnpm install --frozen-lockfile && pnpm build` এবং publish directory হলো `dist`। SPA fallback `netlify.toml`-এ দেওয়া আছে।

## Environment

ভবিষ্যৎ integration-এর জন্য `.env.example`-এ browser-safe Supabase URL/anon key এবং server-only service-role/Brevo placeholders আছে। বাস্তব secret কখনো git, browser bundle, prompt বা commit-এ লিখবেন না।

## Production যাওয়ার আগে বাধ্যতামূলক কাজ

বাস্তব Supabase বা Brevo account-এ সংযোগের আগে read-only audit করতে হবে। Project ID/region, সব table/view/function/trigger, column/foreign key/enum, row count, RLS policy, Auth-to-member linkage, reservation state, Storage bucket/object policy, gallery/site settings path এবং Brevo sender/notification path লিখিতভাবে map করতে হবে। Existing members, Auth users, member photos, financial ledgers, dashboard totals, site settings এবং RPC/RLS কোনোভাবেই delete, truncate, rename বা overwrite করা যাবে না।

Audit report review ও backup/export plan অনুমোদনের পরে additive migration SQL আলাদা করে দেখাতে হবে। Canonical ledger ছাড়া member sheet-এ duplicate financial row তৈরি করা যাবে না। Production integration হলে server-side/RPC/RLS role checks, Storage compression/metadata, Brevo sender verification, Bengali error mapping, selected-period reports এবং pure helper tests যোগ করতে হবে।
