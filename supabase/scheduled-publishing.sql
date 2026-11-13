-- FEBRIA MEDIA scheduled publishing
-- Run in Supabase SQL Editor after schema.sql.
-- Approved stories with a due scheduled_at are made public.
create or replace function public.publish_scheduled_articles()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare changed_count integer;
begin
 update public.articles
 set status='published',
     published_at=coalesce(scheduled_at,now()),
     updated_at=now()
 where status='approved'
   and scheduled_at is not null
   and scheduled_at <= now();
 get diagnostics changed_count = row_count;
 return changed_count;
end;
$$;
revoke all on function public.publish_scheduled_articles() from public, anon, authenticated;
grant execute on function public.publish_scheduled_articles() to service_role;

-- OPTIONAL: enable pg_cron extension in Supabase Database > Extensions,
-- then run this block to execute the publisher once per minute.
-- select cron.schedule(
--   'febria-publish-scheduled',
--   '* * * * *',
--   $$select public.publish_scheduled_articles();$$
-- );
-- Check jobs: select * from cron.job;
-- Remove job if needed: select cron.unschedule('febria-publish-scheduled');
