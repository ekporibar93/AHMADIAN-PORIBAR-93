# আহমদিয়ান পরিবার-93 — সেটআপ ও ব্যবহার গাইড

এই রেপোজিটরির বর্তমান সংস্করণটি Vite + TypeScript-এর Bengali cooperative-management website। `/`-এ public homepage এবং `/hisab`-এ Supabase Auth-protected accounting shell আছে। Login এখন বাস্তব Supabase Auth ব্যবহার করে; accounting rows, CMS mutation এবং role policy এখনো safe migration approval-এর অধীনে।

## হিসাব ঘরে login করার নিয়ম

১. Homepage-এর **হিসাব ঘর** বা **সদস্য প্রবেশ** button চাপুন।

২. ইমেইল ঘরে `ekporibar93@gmail.com` লিখুন।

৩. আপনার সেট করা Supabase password লিখুন এবং **হিসাব ঘরে প্রবেশ** চাপুন।

৪. Supabase Auth session যাচাই হলে `/hisab` dashboard খুলবে। Sign out করলে Supabase session শেষ হবে। এই account email-confirmed Admin profile হিসেবে Supabase-এ যুক্ত আছে।

৫. বর্তমান dashboard-এর ledger, reports ও gallery অংশে demo presentation data দেখা যায়; production financial data mutation চালু করা হয়নি।

## Admin panel কী

Admin panel হলো সাইট ও সমিতির ব্যবস্থাপনার জায়গা। Production integration চালু হলে Admin role থেকে site settings, logo/contact, gallery, presentation posts, সদস্য approval/suspension, member roles এবং canonical deposit/expense ledger পরিচালনা করা যাবে। Moderator-এর scope সীমিত থাকবে; Member কেবল নিজের অনুমোদিত read-only হিসাব দেখবে।

বর্তমান UI-তে Admin panel-এর management cards ও permission explanation আছে, কিন্তু বাস্তব save, edit বা delete operation চালু নেই। Supabase RLS/RPC policy এবং server-side role checks additive migration হিসেবে অনুমোদিত হওয়ার পরেই production mutation চালু হবে।

## এখন কি সব কিছু edit/add/delete করা যাবে?

না, বর্তমান সংস্করণে যাবে না। Public homepage-এর gallery, posts, member records, ledger amount বা Admin settings স্থায়ীভাবে edit/add/delete হয় না। Existing Supabase members, Auth users, financial ledgers, site settings, storage objects, RPC এবং policies preserve করে production CRUD চালু করতে হলে আগে exact additive SQL, role model, audit trail এবং rollback plan review করতে হবে। কোনো delete action destructive হলে আলাদা confirmation ও audit trail রাখা হবে।

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

Netlify build command হলো `pnpm install --frozen-lockfile && pnpm build` এবং publish directory হলো `dist`। SPA fallback `netlify.toml`-এ দেওয়া আছে। Netlify site `ahmadian93`-এ browser-safe `VITE_SUPABASE_URL` এবং `VITE_SUPABASE_ANON_KEY` values configured করা হয়েছে।

## Environment

`.env.example`-এ browser-safe Supabase URL/publishable key এবং server-only service-role/Brevo placeholders আছে। Browser build-এ শুধু `VITE_*` public values যাবে। Service-role key কখনো git, browser bundle, prompt বা commit-এ লিখবেন না; project-এর protected secret store-এ রাখা আছে। Brevo এখনো connected নয়, তাই notification email pending।

## Production যাওয়ার আগে বাধ্যতামূলক কাজ

বাস্তব Supabase বা Brevo account-এ সংযোগের আগে read-only audit করতে হবে। Project ID/region, সব table/view/function/trigger, column/foreign key/enum, row count, RLS policy, Auth-to-member linkage, reservation state, Storage bucket/object policy, gallery/site settings path এবং Brevo sender/notification path লিখিতভাবে map করতে হবে। Existing members, Auth users, member photos, financial ledgers, dashboard totals, site settings এবং RPC/RLS কোনোভাবেই delete, truncate, rename বা overwrite করা যাবে না।

Audit report review ও backup/export plan অনুমোদনের পরে additive migration SQL আলাদা করে দেখাতে হবে। Canonical ledger ছাড়া member sheet-এ duplicate financial row তৈরি করা যাবে না। Production integration হলে server-side/RPC/RLS role checks, Storage compression/metadata, Brevo sender verification, Bengali error mapping, selected-period reports এবং pure helper tests যোগ করতে হবে।
