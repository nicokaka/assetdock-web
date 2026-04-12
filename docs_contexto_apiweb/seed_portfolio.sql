DO $$
DECLARE
    v_org_id UUID;
    v_admin_user_id UUID;

    v_mac_cat_id UUID := gen_random_uuid();
    v_pc_cat_id UUID := gen_random_uuid();
    v_monitor_cat_id UUID := gen_random_uuid();
    v_phone_cat_id UUID := gen_random_uuid();
    v_badge_cat_id UUID := gen_random_uuid();

    v_apple_mfg_id UUID := gen_random_uuid();
    v_dell_mfg_id UUID := gen_random_uuid();
    v_hq_loc_id UUID := gen_random_uuid();
    v_remote_loc_id UUID := gen_random_uuid();

    v_user1_id UUID := gen_random_uuid();
    v_user2_id UUID := gen_random_uuid();
    v_user3_id UUID := gen_random_uuid();
    v_user4_id UUID := gen_random_uuid();

    v_asset1_id UUID := gen_random_uuid();
    v_asset2_id UUID := gen_random_uuid();
    v_asset3_id UUID := gen_random_uuid();
    v_asset4_id UUID := gen_random_uuid();
    v_asset5_id UUID := gen_random_uuid();
    v_asset6_id UUID := gen_random_uuid();
    v_asset7_id UUID := gen_random_uuid();
BEGIN
    -- 1. Obter o Org ID e Admin ID existentes (gerados pelo seeder ou login anterior)
    SELECT id INTO STRICT v_org_id FROM organizations LIMIT 1;
    SELECT id INTO v_admin_user_id FROM users WHERE organization_id = v_org_id LIMIT 1;

    -- Se não achou admin, apenas criamos os logs sem admin vinculado
    
    -- 2. Categorias
    INSERT INTO categories (id, organization_id, name, description, active) VALUES
        (v_mac_cat_id, v_org_id, 'Laptop (Mac)', 'Apple MacBooks', true),
        (v_pc_cat_id, v_org_id, 'Laptop (PC)', 'Windows/Linux Laptops', true),
        (v_monitor_cat_id, v_org_id, 'Monitor', 'External Displays', true),
        (v_phone_cat_id, v_org_id, 'Mobile Phone', 'Corporate Phones', true),
        (v_badge_cat_id, v_org_id, 'Access Badge', 'Physical NFC Badges', true);

    -- 3. Fabricantes
    INSERT INTO manufacturers (id, organization_id, name, description, active) VALUES
        (v_apple_mfg_id, v_org_id, 'Apple', 'Apple Inc.', true),
        (v_dell_mfg_id, v_org_id, 'Dell', 'Dell Technologies', true);

    -- 4. Localidades
    INSERT INTO locations (id, organization_id, name, description, active) VALUES
        (v_hq_loc_id, v_org_id, 'Auckland HQ - Floor 3', 'Main Office', true),
        (v_remote_loc_id, v_org_id, 'Remote (WFH)', 'Work from Home assignments', true);

    -- 5. Usuários (para preencher o dashboard com pessoas reais)
    INSERT INTO users (id, organization_id, email, full_name, password_hash, status, created_at) VALUES
        (v_user1_id, v_org_id, 'amanda.silva@assetdock.local', 'Amanda Silva', 'dummy', 'ACTIVE', NOW() - INTERVAL '30 days'),
        (v_user2_id, v_org_id, 'chloe.chen@assetdock.local', 'Chloe Chen', 'dummy', 'ACTIVE', NOW() - INTERVAL '15 days'),
        (v_user3_id, v_org_id, 'thomas.williams@assetdock.local', 'Thomas Williams', 'dummy', 'ACTIVE', NOW() - INTERVAL '10 days'),
        (v_user4_id, v_org_id, 'alex.murphy@assetdock.local', 'Alex Murphy', 'dummy', 'INACTIVE', NOW() - INTERVAL '5 days');

    INSERT INTO user_roles (user_id, role) VALUES
        (v_user1_id, 'VIEWER'),
        (v_user2_id, 'VIEWER'),
        (v_user3_id, 'VIEWER'),
        (v_user4_id, 'VIEWER');

    -- 6. Ativos
    INSERT INTO assets (id, organization_id, asset_tag, serial_number, hostname, display_name, description, category_id, manufacturer_id, current_location_id, current_assigned_user_id, status, purchase_date, created_at) VALUES
        (v_asset1_id, v_org_id, 'AST-MBP-001', 'C02F239XMD6T', 'nz-eng-mac-01', 'MacBook Pro 16" M3 Max', 'Engineering Team Primary', v_mac_cat_id, v_apple_mfg_id, v_remote_loc_id, v_user1_id, 'ACTIVE', '2023-11-15', NOW() - INTERVAL '20 days'),
        (v_asset2_id, v_org_id, 'AST-MBP-002', 'C02G338YME7U', 'nz-eng-mac-02', 'MacBook Pro 14" M3 Pro', 'Engineering Team Secondary', v_mac_cat_id, v_apple_mfg_id, v_hq_loc_id, v_user2_id, 'ACTIVE', '2023-11-20', NOW() - INTERVAL '18 days'),
        (v_asset3_id, v_org_id, 'AST-MON-001', 'CN-0P1Y0K-74261', NULL, 'Dell UltraSharp 27" 4K', 'Hotdesk monitor #12', v_monitor_cat_id, v_dell_mfg_id, v_hq_loc_id, NULL, 'IN_STOCK', '2022-05-10', NOW() - INTERVAL '25 days'),
        (v_asset4_id, v_org_id, 'AST-PHN-001', 'DNPG319XN732', 'iPhone-Chloe', 'iPhone 15 Pro', 'Sales Department', v_phone_cat_id, v_apple_mfg_id, v_remote_loc_id, v_user2_id, 'ACTIVE', '2023-09-25', NOW() - INTERVAL '15 days'),
        (v_asset5_id, v_org_id, 'AST-BDG-102', 'NFC-993-12', NULL, 'HQ Access Badge', 'Card ID: 109283', v_badge_cat_id, NULL, v_hq_loc_id, NULL, 'LOST', NULL, NOW() - INTERVAL '60 days'),
        (v_asset6_id, v_org_id, 'AST-MBP-003', 'C02H412ZMF8V', 'nz-dev-mac-03', 'MacBook Air 15" M2', 'Office loaner', v_mac_cat_id, v_apple_mfg_id, v_hq_loc_id, NULL, 'IN_MAINTENANCE', '2023-08-01', NOW() - INTERVAL '10 days'),
        (v_asset7_id, v_org_id, 'AST-PC-001', '5P1X8Y2', 'nz-fin-dell-01', 'Dell XPS 15', 'Finance Team', v_pc_cat_id, v_dell_mfg_id, v_hq_loc_id, v_user4_id, 'RETIRED', '2019-03-15', NOW() - INTERVAL '40 days');

    -- 7. Assignments (Mocking history)
    INSERT INTO asset_assignments (id, organization_id, asset_id, user_id, assigned_by, assigned_at, unassigned_at, location_id, notes) VALUES
        (gen_random_uuid(), v_org_id, v_asset1_id, v_user1_id, COALESCE(v_admin_user_id, v_user1_id), NOW() - INTERVAL '19 days', NULL, v_remote_loc_id, 'Initial provision for Engineering.'),
        (gen_random_uuid(), v_org_id, v_asset2_id, v_user2_id, COALESCE(v_admin_user_id, v_user1_id), NOW() - INTERVAL '17 days', NULL, v_hq_loc_id, 'Assigned internally.'),
        (gen_random_uuid(), v_org_id, v_asset4_id, v_user2_id, COALESCE(v_admin_user_id, v_user1_id), NOW() - INTERVAL '14 days', NULL, v_remote_loc_id, 'Corporate phone provision.'),
        (gen_random_uuid(), v_org_id, v_asset6_id, v_user3_id, COALESCE(v_admin_user_id, v_user1_id), NOW() - INTERVAL '20 days', NOW() - INTERVAL '2 days', v_hq_loc_id, 'Loaner returned damaged, sent to repair.'),
        (gen_random_uuid(), v_org_id, v_asset7_id, v_user4_id, COALESCE(v_admin_user_id, v_user1_id), NOW() - INTERVAL '30 days', NOW() - INTERVAL '5 days', v_hq_loc_id, 'User terminated. Laptop too old, retiring asset.');

    -- 8. Audit Logs (to make the Audit tab look populated)
    INSERT INTO audit_logs (id, organization_id, actor_user_id, event_type, resource_type, resource_id, outcome, ip_address, user_agent, details_json, occurred_at) VALUES
        (gen_random_uuid(), v_org_id, v_admin_user_id, 'USER_CREATED', 'USER', v_user1_id, 'SUCCESS', '192.168.1.1', 'Mozilla/5.0', '{"email": "amanda.silva@assetdock.local"}', NOW() - INTERVAL '30 days'),
        (gen_random_uuid(), v_org_id, v_admin_user_id, 'ASSET_CREATED', 'ASSET', v_asset1_id, 'SUCCESS', '192.168.1.1', 'Mozilla/5.0', '{"asset_tag": "AST-MBP-001"}', NOW() - INTERVAL '20 days'),
        (gen_random_uuid(), v_org_id, v_admin_user_id, 'ASSET_ASSIGNED', 'ASSET', v_asset1_id, 'SUCCESS', '192.168.1.1', 'Mozilla/5.0', '{"assigned_to_user_id": "' || v_user1_id || '"}', NOW() - INTERVAL '19 days'),
        (gen_random_uuid(), v_org_id, v_admin_user_id, 'ASSET_UPDATED', 'ASSET', v_asset6_id, 'SUCCESS', '192.168.1.1', 'Mozilla/5.0', '{"old_status": "ACTIVE", "new_status": "IN_MAINTENANCE"}', NOW() - INTERVAL '2 days'),
        (gen_random_uuid(), v_org_id, v_admin_user_id, 'ASSET_UNASSIGNED', 'ASSET', v_asset7_id, 'SUCCESS', '192.168.1.1', 'Mozilla/5.0', '{}', NOW() - INTERVAL '5 days'),
        (gen_random_uuid(), v_org_id, v_admin_user_id, 'USER_UPDATED', 'USER', v_user4_id, 'SUCCESS', '192.168.1.1', 'Mozilla/5.0', '{"old_status": "ACTIVE", "new_status": "INACTIVE"}', NOW() - INTERVAL '4 days'),
        (gen_random_uuid(), v_org_id, v_admin_user_id, 'LOGIN_SUCCESS', 'USER', v_admin_user_id, 'SUCCESS', '203.0.113.42', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '{}', NOW() - INTERVAL '2 hours');

    RAISE NOTICE 'Dados de demonstração populados com sucesso no AssetDock!';
END $$;
