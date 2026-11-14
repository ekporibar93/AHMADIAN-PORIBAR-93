# প্রস্তাবিত Supabase production policy

`20261114_additive_rbac_policies.sql` এখনো production-এ apply করা হয়নি। এটি review-এর জন্য প্রস্তুত করা additive draft।

এটি যা করবে:

- `cooperativeSettings` ও `galleryItems` public read করবে, যাতে homepage/CMS data পড়া যায়।
- Authenticated user নিজের `public.users`/`members` record পড়তে পারবে। Admin ও Moderator staff-level read access পাবে।
- Admin settings, members, ledger entries, gallery এবং private `cooperative-gallery` Storage object পরিচালনা করতে পারবে।
- Member ledger read access কেবল নিজের linked member row-এর জন্য থাকবে।
- Client-side user নিজে profile, member role, ledger বা gallery row insert/update/delete করতে পারবে না; Admin policy লাগবে।
- `notificationEvents` client write খুলবে না; Brevo integration pending থাকবে।

নিরাপত্তা সীমা:

- কোনো table, row, Auth user, Storage object, RPC, existing privilege বা existing policy drop/truncate/rename করা নেই।
- Existing broad SQL privileges revoke করা হয়নি; RLS policy gate হিসেবে যোগ হবে। Privilege tightening আলাদা review ছাড়া করা হবে না।
- Existing `touch_updated_at` function পরিবর্তন করা হয়নি। নতুন helper functions fixed `search_path` ব্যবহার করে।
- Private gallery bucket public করা হয়নি; public gallery delivery-এর জন্য signed URL/server-side path আলাদা করে implement করতে হবে।
- এই draft apply করার আগে user-এর explicit confirmation দরকার। Apply হওয়ার পর Supabase policy verification, Auth-to-profile verification, role matrix test এবং Netlify production smoke test করতে হবে।
