-- ============================================================================
-- Seed data — matches the Phase 1 sample schedule exactly.
-- Run this AFTER schema.sql, once, in the Supabase SQL Editor.
-- Safe to re-run: it deletes any existing rows with the same slug/name first.
-- ============================================================================

begin;

delete from schedules where slug = 'customer-care';
delete from templates where name = 'Customer Care Newcomer – Standard';

do $$
declare
  tmpl_id uuid;
  d1 uuid; d2 uuid; d3 uuid; d4 uuid; d5 uuid; d6 uuid;
  sched_id uuid;
  td1 uuid; td2 uuid; td3 uuid; td4 uuid; td5 uuid; td6 uuid;
begin
  -- ---------- Template + template days ----------

  insert into templates (name, description, skip_weekends)
  values ('Customer Care Newcomer – Standard', 'Standard 6-day onboarding for new Customer Care hires.', true)
  returning id into tmpl_id;

  insert into template_days (template_id, day_number, title, sort_order) values
    (tmpl_id, 1, 'Introduction & Company', 1) returning id into d1;
  insert into template_days (template_id, day_number, title, sort_order) values
    (tmpl_id, 2, 'Website Builder', 2) returning id into d2;
  insert into template_days (template_id, day_number, title, sort_order) values
    (tmpl_id, 3, 'Business Website, AI & Domains', 3) returning id into d3;
  insert into template_days (template_id, day_number, title, sort_order) values
    (tmpl_id, 4, 'Emails & Online Store', 4) returning id into d4;
  insert into template_days (template_id, day_number, title, sort_order) values
    (tmpl_id, 5, 'Customer Communication & Freshdesk & Tools', 5) returning id into d5;
  insert into template_days (template_id, day_number, title, sort_order) values
    (tmpl_id, 6, 'Payments, Refunds & Affiliate', 6) returning id into d6;

  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d1, 'training', 'Welcome & Company Introduction', 'Kate', '09:00', '10:15', 'Meet the team, get an overview of Webnode, and understand how Customer Care fits into the bigger picture.', 1);
  insert into template_activities (template_day_id, type, title, start_time, end_time, sort_order) values
    (d1, 'break', 'Break', '10:15', '10:30', 2);
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d1, 'training', 'Customer Care Basics', 'Martin', '11:00', '12:30', 'The fundamentals of how our Customer Care team works, our tone of voice, and what great support looks like.', 3);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, url, start_time, sort_order) values
    (d1, 'learning_hub', 'Customer Care Introduction', 'Complete the "Customer Care Introduction" lesson in the Learning Hub.', 30, '#', '14:00', 4);

  -- Day 2 activities
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d2, 'training', 'Website Builder Basics', 'Kate', '09:00', '10:30', 'A hands-on walkthrough of the Website Builder — the tool most of our customers use every day.', 1);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, url, start_time, sort_order) values
    (d2, 'learning_hub', 'Website Builder Lesson', 'Complete the Website Builder lesson in the Learning Hub.', 30, '#', '13:00', 2);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, start_time, sort_order) values
    (d2, 'task', 'Create Your First Test Website', 'Use the Website Builder to create a simple test website from scratch. No need to publish it.', 45, '15:00', 3);

  -- Day 3 activities
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d3, 'training', 'Business Website & AI Tools', 'Martin', '09:00', '10:30', 'How our Business Website product works, and the AI tools that help customers build faster.', 1);
  insert into template_activities (template_day_id, type, title, start_time, end_time, sort_order) values
    (d3, 'break', 'Lunch Break', '12:00', '13:00', 2);
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d3, 'training', 'Domains Explained', 'Kate', '13:00', '14:00', 'Domain registration, connection, and the most common customer questions around domains.', 3);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, url, start_time, sort_order) values
    (d3, 'learning_hub', 'Domains & Business Website Lesson', 'Complete the Domains & Business Website lesson in the Learning Hub.', 25, '#', '15:00', 4);

  -- Day 4 activities
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d4, 'training', 'Email Accounts & Marketing', 'Martin', '09:00', '10:15', 'Setting up email accounts and the basics of email marketing tools.', 1);
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d4, 'training', 'Online Store Basics', 'Maria', '10:30', '12:00', 'How the Online Store product works, from product listings to checkout.', 2);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, start_time, sort_order) values
    (d4, 'task', 'Set Up a Test Online Store', 'Add three products to a test store and walk through the checkout flow as a customer would.', 40, '14:00', 3);

  -- Day 5 activities
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d5, 'training', 'Customer Communication', 'Kate', '09:00', '10:00', 'How we talk to customers — tone, empathy, and handling difficult conversations.', 1);
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d5, 'training', 'Freshdesk Basics', 'Maria', '10:15', '11:00', 'Navigating Freshdesk: tickets, views, and the tools you''ll use every day.', 2);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, url, sort_order) values
    (d5, 'learning_hub', 'Customer Communication Lesson', 'Complete the "Customer Communication" lesson in the Learning Hub.', 30, '#', 3);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, sort_order) values
    (d5, 'task', 'Freshdesk Search Task', 'Find the user''s role in Webnode Tools using a Freshdesk search.', 20, 4);

  -- Day 6 activities
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d6, 'training', 'Payments & Billing', 'Martin', '09:00', '10:15', 'How payments and billing cycles work, and how to read a customer''s billing history.', 1);
  insert into template_activities (template_day_id, type, title, trainer, start_time, end_time, description, sort_order) values
    (d6, 'training', 'Refunds & the Affiliate Program', 'Maria', '10:30', '11:30', 'Our refund policy in practice, plus an overview of the Affiliate Program.', 2);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, url, start_time, sort_order) values
    (d6, 'learning_hub', 'Payments & Refunds Lesson', 'Complete the Payments & Refunds lesson in the Learning Hub.', 25, '#', '13:00', 3);
  insert into template_activities (template_day_id, type, title, description, estimated_minutes, start_time, sort_order) values
    (d6, 'task', 'Practice Refund Scenario', 'Work through a sample refund request end to end, from ticket to resolution.', 30, '14:00', 4);

  -- ---------- Publish a schedule from this template ----------
  -- Start date: August 17, 2026 (a Monday), skipping weekends —
  -- this matches the Phase 1 sample data exactly.

  insert into schedules (template_id, name, slug, start_date, skip_weekends, status, published_at)
  values (tmpl_id, 'Customer Care Newcomer – Standard', 'customer-care', date '2026-08-17', true, 'published', now())
  returning id into sched_id;

  insert into training_days (schedule_id, day_number, title, date, sort_order)
  values
    (sched_id, 1, 'Introduction & Company', date '2026-08-17', 1),
    (sched_id, 2, 'Website Builder', date '2026-08-18', 2),
    (sched_id, 3, 'Business Website, AI & Domains', date '2026-08-19', 3),
    (sched_id, 4, 'Emails & Online Store', date '2026-08-20', 4),
    (sched_id, 5, 'Customer Communication & Freshdesk & Tools', date '2026-08-21', 5),
    (sched_id, 6, 'Payments, Refunds & Affiliate', date '2026-08-24', 6);

  select id into td1 from training_days where schedule_id = sched_id and day_number = 1;
  select id into td2 from training_days where schedule_id = sched_id and day_number = 2;
  select id into td3 from training_days where schedule_id = sched_id and day_number = 3;
  select id into td4 from training_days where schedule_id = sched_id and day_number = 4;
  select id into td5 from training_days where schedule_id = sched_id and day_number = 5;
  select id into td6 from training_days where schedule_id = sched_id and day_number = 6;

  -- Copy every template_activity into the real schedule's activities,
  -- day by day (this mirrors exactly what the "Publish Schedule" action
  -- in the admin UI will do in Phase 3+).
  insert into activities (training_day_id, type, title, description, trainer, start_time, end_time, estimated_minutes, url, location, sort_order)
  select td1, type, title, description, trainer, start_time, end_time, estimated_minutes, url, location, sort_order from template_activities where template_day_id = d1
  union all
  select td2, type, title, description, trainer, start_time, end_time, estimated_minutes, url, location, sort_order from template_activities where template_day_id = d2
  union all
  select td3, type, title, description, trainer, start_time, end_time, estimated_minutes, url, location, sort_order from template_activities where template_day_id = d3
  union all
  select td4, type, title, description, trainer, start_time, end_time, estimated_minutes, url, location, sort_order from template_activities where template_day_id = d4
  union all
  select td5, type, title, description, trainer, start_time, end_time, estimated_minutes, url, location, sort_order from template_activities where template_day_id = d5
  union all
  select td6, type, title, description, trainer, start_time, end_time, estimated_minutes, url, location, sort_order from template_activities where template_day_id = d6;

end $$;

commit;
