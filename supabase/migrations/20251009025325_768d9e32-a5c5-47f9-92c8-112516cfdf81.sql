-- Grant admin role to user hussenaemuhumad@gmail.com
INSERT INTO public.user_roles (user_id, role)
VALUES ('fbcc5879-a110-4005-969c-36307d10658e', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;