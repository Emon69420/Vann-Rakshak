-- Seed data for FRA Atlas + Decision Support System

-- Sample profiles (users will be created via Supabase Auth)
-- You'll need to replace these UUIDs with actual user IDs from auth.users after registration

-- Sample super admin
INSERT INTO public.profiles (id, full_name, email, role, district, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'Admin User', 'admin@fra-atlas.gov.in', 'super_admin', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440001', 'Bastar District Admin', 'admin.bastar@fra-atlas.gov.in', 'district_admin', 'Bastar', NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Chhattisgarh State Admin', 'admin.cg@fra-atlas.gov.in', 'state_admin', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Ram Kumar', 'ram.kumar@example.com', 'patta_holder', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Sita Devi', 'sita.devi@example.com', 'patta_holder', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'Mohan Tribal', 'mohan.tribal@example.com', 'patta_holder', NULL, NOW());

-- Sample FRA claims
INSERT INTO public.fra_claims (id, user_id, village_name, district, state, claim_type, area_hectares, status, submitted_at, document_url, shapefile_url, metadata_json) VALUES 
(
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440003',
    'Kanker',
    'Bastar',
    'Chhattisgarh',
    'IFR',
    1.5,
    'pending',
    NOW() - INTERVAL '5 days',
    'fra-claims-docs/550e8400-e29b-41d4-a716-446655440003/sample_document.pdf',
    'fra-shapefiles/550e8400-e29b-41d4-a716-446655440003/sample_shapefile.json',
    '{
        "ocrResult": {
            "extractedText": "FRA Claim Application - Ram Kumar, Village Kanker, Bastar District, Individual Forest Rights, 1.5 hectares",
            "confidence": 0.87
        },
        "nerResult": {
            "entities": [
                {"text": "Ram Kumar", "label": "PERSON", "confidence": 0.92},
                {"text": "Kanker", "label": "VILLAGE", "confidence": 0.95},
                {"text": "Bastar", "label": "DISTRICT", "confidence": 0.93},
                {"text": "1.5", "label": "AREA", "confidence": 0.89}
            ]
        },
        "extractedMetadata": {
            "applicantName": "Ram Kumar",
            "villageName": "Kanker",
            "district": "Bastar",
            "state": "Chhattisgarh",
            "claimType": "IFR",
            "areaInHectares": 1.5
        }
    }'
),
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440004',
    'Kondagaon',
    'Bastar',
    'Chhattisgarh',
    'CFR',
    5.2,
    'approved',
    NOW() - INTERVAL '15 days',
    'fra-claims-docs/550e8400-e29b-41d4-a716-446655440004/community_document.pdf',
    NULL,
    '{
        "extractedMetadata": {
            "applicantName": "Sita Devi (Community Representative)",
            "villageName": "Kondagaon",
            "district": "Bastar", 
            "state": "Chhattisgarh",
            "claimType": "CFR",
            "areaInHectares": 5.2
        }
    }'
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440005',
    'Jagdalpur',
    'Bastar',
    'Chhattisgarh',
    'IFR',
    0.8,
    'pending',
    NOW() - INTERVAL '2 days',
    NULL,
    NULL,
    '{
        "extractedMetadata": {
            "applicantName": "Mohan Tribal",
            "villageName": "Jagdalpur",
            "district": "Bastar",
            "state": "Chhattisgarh",
            "claimType": "IFR",
            "areaInHectares": 0.8
        }
    }'
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Narayanpur',
    'Narayanpur',
    'Chhattisgarh',
    'CR',
    2.3,
    'rejected',
    NOW() - INTERVAL '20 days',
    'fra-claims-docs/550e8400-e29b-41d4-a716-446655440003/narayanpur_doc.pdf',
    'fra-shapefiles/550e8400-e29b-41d4-a716-446655440003/narayanpur_shape.json',
    '{
        "extractedMetadata": {
            "applicantName": "Ram Kumar",
            "villageName": "Narayanpur",
            "district": "Narayanpur",
            "state": "Chhattisgarh",
            "claimType": "CR",
            "areaInHectares": 2.3
        },
        "adminNotes": "Insufficient documentation provided"
    }'
);

-- Sample asset maps with geospatial data
INSERT INTO public.asset_maps (id, village_name, district, state, asset_type, geojson, map_tile_url, source, last_updated) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440000',
    'Kanker',
    'Bastar',
    'Chhattisgarh',
    'agriculture',
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [81.9356, 20.2961],
            [81.9366, 20.2961],
            [81.9366, 20.2971],
            [81.9356, 20.2971],
            [81.9356, 20.2961]
        ]]
    }'),
    NULL,
    'ai_detection',
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    'Kanker',
    'Bastar',
    'Chhattisgarh',
    'forest',
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [81.9346, 20.2951],
            [81.9356, 20.2951],
            [81.9356, 20.2961],
            [81.9346, 20.2961],
            [81.9346, 20.2951]
        ]]
    }'),
    NULL,
    'satellite_imagery',
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440002',
    'Kondagaon',
    'Bastar',
    'Chhattisgarh',
    'water_body',
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [81.3456, 19.5961],
            [81.3466, 19.5961],
            [81.3466, 19.5966],
            [81.3456, 19.5966],
            [81.3456, 19.5961]
        ]]
    }'),
    NULL,
    'manual_upload',
    NOW()
),
(
    '770e8400-e29b-41d4-a716-446655440003',
    'Jagdalpur',
    'Bastar',
    'Chhattisgarh',
    'homestead',
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [82.0256, 19.0861],
            [82.0259, 19.0861],
            [82.0259, 19.0864],
            [82.0256, 19.0864],
            [82.0256, 19.0861]
        ]]
    }'),
    NULL,
    'manual_upload',
    NOW()
);

-- Sample scheme recommendations
INSERT INTO public.scheme_recommendations (id, fra_claim_id, recommended_schemes, generated_at, engine_version) VALUES 
(
    '880e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '[
        {
            "scheme_id": "pm-kisan",
            "scheme_name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
            "relevance_score": 0.92,
            "eligibility_match": true,
            "reasoning": "Land area is within 2 hectares limit; Agricultural land detected in asset mapping",
            "priority": "high"
        },
        {
            "scheme_id": "mgnrega",
            "scheme_name": "MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)",
            "relevance_score": 0.85,
            "eligibility_match": true,
            "reasoning": "Universal rural employment scheme; Small landholders often need additional income sources",
            "priority": "high"
        },
        {
            "scheme_id": "forest-rights-act",
            "scheme_name": "Forest Rights Act Implementation Support",
            "relevance_score": 0.78,
            "eligibility_match": true,
            "reasoning": "Individual Forest Rights claim - relevant for implementation support",
            "priority": "medium"
        },
        {
            "scheme_id": "soil-health-card",
            "scheme_name": "Soil Health Card Scheme",
            "relevance_score": 0.65,
            "eligibility_match": true,
            "reasoning": "Agricultural land can benefit from soil health assessment",
            "priority": "medium"
        }
    ]',
    NOW() - INTERVAL '3 days',
    'v1.0.0'
),
(
    '880e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '[
        {
            "scheme_id": "forest-rights-act",
            "scheme_name": "Forest Rights Act Implementation Support",
            "relevance_score": 0.95,
            "eligibility_match": true,
            "reasoning": "Community Forest Rights claim - highly relevant",
            "priority": "high"
        },
        {
            "scheme_id": "mgnrega",
            "scheme_name": "MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)",
            "relevance_score": 0.75,
            "eligibility_match": true,
            "reasoning": "Universal rural employment scheme",
            "priority": "medium"
        },
        {
            "scheme_id": "jal-jeevan-mission",
            "scheme_name": "Jal Jeevan Mission",
            "relevance_score": 0.68,
            "eligibility_match": true,
            "reasoning": "Community forest rights holders can benefit from village-level water projects",
            "priority": "medium"
        }
    ]',
    NOW() - INTERVAL '10 days',
    'v1.0.0'
);

-- Sample audit logs
INSERT INTO public.logs (id, user_id, action, metadata, timestamp) VALUES 
('990e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003', 'upload_claim', '{"claim_id": "660e8400-e29b-41d4-a716-446655440000", "village_name": "Kanker", "district": "Bastar", "state": "Chhattisgarh"}', NOW() - INTERVAL '5 days'),
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'claim_approved', '{"claim_id": "660e8400-e29b-41d4-a716-446655440001", "previous_status": "pending", "new_status": "approved"}', NOW() - INTERVAL '12 days'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'generate_dss_recommendations', '{"claim_id": "660e8400-e29b-41d4-a716-446655440000", "recommendations_count": 4}', NOW() - INTERVAL '3 days'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'detect_assets', '{"village": "Kanker", "district": "Bastar", "state": "Chhattisgarh", "assets_detected": 2}', NOW() - INTERVAL '4 days'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'claim_rejected', '{"claim_id": "660e8400-e29b-41d4-a716-446655440003", "previous_status": "pending", "new_status": "rejected", "admin_notes": "Insufficient documentation provided"}', NOW() - INTERVAL '18 days'),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 'upload_claim', '{"claim_id": "660e8400-e29b-41d4-a716-446655440002", "village_name": "Jagdalpur", "district": "Bastar", "state": "Chhattisgarh"}', NOW() - INTERVAL '2 days');

-- Update approved claims with approval details
UPDATE public.fra_claims 
SET approved_at = NOW() - INTERVAL '12 days',
    approved_by = '550e8400-e29b-41d4-a716-446655440001'
WHERE id = '660e8400-e29b-41d4-a716-446655440001';

-- Add some additional asset maps for diversity
INSERT INTO public.asset_maps (village_name, district, state, asset_type, geojson, source, last_updated) VALUES 
('Narayanpur', 'Narayanpur', 'Chhattisgarh', 'agriculture', 
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [81.1356, 20.1161],
            [81.1366, 20.1161],
            [81.1366, 20.1171],
            [81.1356, 20.1171],
            [81.1356, 20.1161]
        ]]
    }'),
    'satellite_imagery', NOW()),
    
('Kanker', 'Bastar', 'Chhattisgarh', 'agriculture',
    ST_GeomFromGeoJSON('{
        "type": "Polygon", 
        "coordinates": [[
            [81.9366, 20.2971],
            [81.9376, 20.2971],
            [81.9376, 20.2981],
            [81.9366, 20.2981],
            [81.9366, 20.2971]
        ]]
    }'),
    'ai_detection', NOW()),

('Kondagaon', 'Bastar', 'Chhattisgarh', 'forest',
    ST_GeomFromGeoJSON('{
        "type": "Polygon",
        "coordinates": [[
            [81.3446, 19.5951],
            [81.3456, 19.5951],
            [81.3456, 19.5961],
            [81.3446, 19.5961],
            [81.3446, 19.5951]
        ]]
    }'),
    'satellite_imagery', NOW());

-- Add more sample users with different roles for testing
INSERT INTO public.profiles (id, full_name, email, role, district, created_at) VALUES 
('550e8400-e29b-41d4-a716-446655440006', 'Sunita Farmer', 'sunita.farmer@example.com', 'patta_holder', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'Ravi Tribal', 'ravi.tribal@example.com', 'patta_holder', NULL, NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'Narayanpur Admin', 'admin.narayanpur@fra-atlas.gov.in', 'district_admin', 'Narayanpur', NOW());

-- Comments for database administrators
COMMENT ON TABLE public.profiles IS 'User profiles with role-based access control';
COMMENT ON TABLE public.fra_claims IS 'Forest Rights Act claims submitted by users';
COMMENT ON TABLE public.asset_maps IS 'Geospatial asset mapping data with PostGIS support';
COMMENT ON TABLE public.scheme_recommendations IS 'AI-generated government scheme recommendations';
COMMENT ON TABLE public.logs IS 'Audit trail for all system actions';

-- Insert some additional recent logs for a more realistic dataset
INSERT INTO public.logs (user_id, action, metadata, timestamp) VALUES 
('550e8400-e29b-41d4-a716-446655440006', 'login', '{"ip_address": "192.168.1.100", "user_agent": "Mozilla/5.0"}', NOW() - INTERVAL '1 hour'),
('550e8400-e29b-41d4-a716-446655440007', 'view_dashboard', '{}', NOW() - INTERVAL '2 hours'),
('550e8400-e29b-41d4-a716-446655440001', 'view_claims', '{"district": "Bastar", "status": "pending"}', NOW() - INTERVAL '30 minutes'),
('550e8400-e29b-41d4-a716-446655440000', 'view_analytics', '{"report": "monthly_summary"}', NOW() - INTERVAL '15 minutes'),
('550e8400-e29b-41d4-a716-446655440008', 'login', '{"ip_address": "10.0.0.50", "user_agent": "Mozilla/5.0"}', NOW() - INTERVAL '3 hours');
