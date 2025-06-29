-- Auth sistemi test scripti
-- Bu scripti users tablosu oluşturulduktan sonra test için çalıştırabilirsiniz

-- 1. Test kullanıcısı login
SELECT 'TEST LOGIN:' as test_step;
SELECT * FROM login_user('test@example.com', '123456');

-- 2. Yeni kullanıcı register
SELECT 'TEST REGISTER:' as test_step;
SELECT * FROM register_user('yeni@test.com', 'parola123', 'Yeni Kullanıcı');

-- 3. Session validation (yukarıdaki session_token'ı buraya yapıştırın)
SELECT 'TEST SESSION VALIDATION:' as test_step;
-- SELECT * FROM validate_session('BURAYA_SESSION_TOKEN_YAPISTIRIN');

-- 4. Kullanıcı listesi
SELECT 'ALL USERS:' as test_step;
SELECT id, email, full_name, is_active, created_at FROM public.users;

-- 5. Aktif session'lar
SELECT 'ACTIVE SESSIONS:' as test_step;
SELECT 
    s.session_token,
    u.email,
    u.full_name,
    s.expires_at,
    CASE 
        WHEN s.expires_at > NOW() THEN 'ACTIVE'
        ELSE 'EXPIRED'
    END as status
FROM public.user_sessions s
JOIN public.users u ON s.user_id = u.id
ORDER BY s.created_at DESC; 