# আহমদিয়ান পরিবার-93 — সেটআপ ও ব্যবহার গাইড

এই রেপোজিটরির বর্তমান সংস্করণটি একটি নিরাপদ front-end prototype। এটি Vite + TypeScript দিয়ে তৈরি, `/`-এ public homepage এবং `/hisab`-এ protected accounting shell দেখায়।

## হিসাব ঘরে login করার নিয়ম

১. Homepage-এর **হিসাব ঘর** বা **সদস্য প্রবেশ** button চাপুন।

২. **সদস্য আইডি বা ইমেইল** ঘরে যেকোনো demo ID লিখুন, যেমন `S-001` বা `demo@example.com`।

৩. **পাসওয়ার্ড** ঘরে কমপক্ষে ৬ অক্ষরের কিছু লিখুন, যেমন `demo123`।

৪. **হিসাব ঘরে প্রবেশ** চাপলে `/hisab` dashboard খুলবে। বর্তমান UI-টি এখনো demo login flow—এটি Supabase Auth-এর সঙ্গে wired নয়; তাই এই form-এ দেওয়া real Supabase password যাচাই হবে না। আলাদা করে Supabase project-এ `ekporibar93@gmail.com` email-confirmed Admin Auth account তৈরি ও password-login smoke test সফল হয়েছে। UI-কে real Auth/RBAC-এর সঙ্গে যুক্ত করা হবে RLS/RPC migration অনুমোদনের পর। Refresh-এর পর demo session browser `sessionStorage`-এ থাকে, আর **সাইন আউট** করলে তা মুছে যায়।

## Admin panel কী

Admin panel হলো সাইট ও সমিতির ব্যবস্থাপনার জায়গা। Production integration চালু হলে Admin role থেকে site settings, logo/contact, gallery, presentation posts, সদস্য approval/suspension, member roles এবং canonical deposit/expense ledger পরিচালনা করা যাবে। Moderator-এর scope সীমিত থাকবে; Member কেবল নিজের অনুমোদিত read-only হিসাব দেখবে।

এই prototype-এ Admin panel-এর management cards ও permission explanation দেখা যায়, কিন্তু কোনো বাস্তব save, edit বা delete operation চালু নেই। Demo screen-এ button চাপলে Bengali status message দেখাবে—এটি ইচ্ছাকৃত, কারণ Supabase audit, RLS policy এবং approval ছাড়া production data mutation করা নিরাপদ নয়।

## এখন কি সব কিছু edit/add/delete করা যাবে?

না, বর্তমান demo সংস্করণে যাবে না। Public homepage-এর gallery, posts, member records, ledger amount বা Admin settings স্থায়ীভাবে edit/add/delete হয় না। বর্তমান কাজটি UI ও flow দেখানোর জন্য; বাস্তব management চালু করতে হলে প্রথমে existing Supabase project-এর read-only audit, backup/export plan, schema mapping, RLS/RPC review এবং additive migration approval প্রয়োজন। এরপর server-side role checks দিয়ে নির্দিষ্ট Admin/Moderator action চালু করা হবে। কোনো delete action destructive হলে আলাদা confirmation ও audit trail রাখা হবে।

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

ভবিষ্যৎ integration-এর জন্য `.env.example`-এ browser-safe Supabase URL/anon key এবং server-only service-role/Brevo placeholders আছে। বাস্তব secret কখনো git, browser bundle, prompt বা commit-এ লিখবেন না। One-time Supabase Auth setup-এর জন্য service-role key protected project secret store-এ রাখা হয়েছে; source code বা frontend bundle-এ নয়।

## Production যাওয়ার আগে বাধ্যতামূলক কাজ

বাস্তব Supabase বা Brevo account-এ সংযোগের আগে read-only audit করতে হবে। Project ID/region, সব table/view/function/trigger, column/foreign key/enum, row count, RLS policy, Auth-to-member linkage, reservation state, Storage bucket/object policy, gallery/site settings path এবং Brevo sender/notification path লিখিতভাবে map করতে হবে। Existing members, Auth users, member photos, financial ledgers, dashboard totals, site settings এবং RPC/RLS কোনোভাবেই delete, truncate, rename বা overwrite করা যাবে না।

Audit report review ও backup/export plan অনুমোদনের পরে additive migration SQL আলাদা করে দেখাতে হবে। Canonical ledger ছাড়া member sheet-এ duplicate financial row তৈরি করা যাবে না। Production integration হলে server-side/RPC/RLS role checks, Storage compression/metadata, Brevo sender verification, Bengali error mapping, selected-period reports এবং pure helper tests যোগ করতে হবে.
