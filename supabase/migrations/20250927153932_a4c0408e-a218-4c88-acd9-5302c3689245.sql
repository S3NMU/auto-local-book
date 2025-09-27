-- Add soft delete columns to track deleted entries
ALTER TABLE customer_records ADD COLUMN deleted_at timestamp with time zone;
ALTER TABLE revenue_entries ADD COLUMN deleted_at timestamp with time zone;
ALTER TABLE bookings ADD COLUMN deleted_at timestamp with time zone;