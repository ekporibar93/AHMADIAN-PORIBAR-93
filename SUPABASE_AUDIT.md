# Read-only audit status

এই sandbox-এ কোনো Supabase project credential, Brevo credential বা source repository connection দেওয়া হয়নি। তাই production schema, Auth users, RLS policies, RPC/functions, triggers, Storage objects, row counts বা sender configuration fabricate করা হয়নি এবং কোনো migration SQL apply বা তৈরি করা হয়নি।

পরবর্তী নিরাপদ ধাপ হবে শুধু read-only audit: project ID/region, public tables/views/functions/triggers, columns/keys/enums/counts, policy summary, Auth-to-member linkage, reserved IDs, Storage buckets/objects, settings/gallery persistence path, Brevo sender flow এবং discrepancy list সংগ্রহ করা। Audit report ও backup/export plan review হওয়ার পরেই additive, idempotent, rollback-documented SQL দেখানো যাবে।
