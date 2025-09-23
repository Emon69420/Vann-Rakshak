# FRA Atlas + Decision Support System - Backend API Documentation

## Overview

The FRA Atlas backend provides a comprehensive API for managing Forest Rights Act claims, asset mapping, and government scheme recommendations. Built on Supabase with PostGIS for geospatial data.

## Architecture

- **Database**: Supabase PostgreSQL with PostGIS extension
- **API**: Supabase Edge Functions (Deno runtime)
- **Authentication**: Supabase Auth with JWT tokens
- **Storage**: Supabase Storage with bucket-based file management
- **Real-time**: Supabase Realtime for live updates

## Authentication

All API endpoints require authentication using JWT tokens from Supabase Auth.

### Headers
\`\`\`
Authorization: Bearer <jwt_token>
Content-Type: application/json
\`\`\`

### User Roles
- `patta_holder`: Can submit and view own claims
- `district_admin`: Can manage claims in their district
- `state_admin`: Can manage claims across the state  
- `super_admin`: Full system access

## API Endpoints

### 1. FRA Claim Management

#### Upload New Claim
\`\`\`http
POST /functions/v1/upload-claim
\`\`\`

**Request Body (multipart/form-data):**
\`\`\`
villageName: string
district: string
state: string
claimType: "IFR" | "CR" | "CFR"
areaHectares: number
document: File (optional)
shapefile: string (optional, GeoJSON)
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "claim": {
    "id": "uuid",
    "user_id": "uuid",
    "village_name": "string",
    "district": "string",
    "state": "string",
    "claim_type": "IFR|CR|CFR",
    "area_hectares": number,
    "status": "pending",
    "document_url": "string",
    "shapefile_url": "string",
    "metadata_json": {}
  },
  "aiMetadata": {
    "extractedText": "string",
    "entitiesFound": number,
    "confidence": number
  }
}
\`\`\`

#### Get User Claims
\`\`\`http
GET /rest/v1/fra_claims?user_id=eq.<user_id>
\`\`\`

### 2. Decision Support System (DSS)

#### Generate Recommendations
\`\`\`http
POST /functions/v1/generate-dss
\`\`\`

**Request Body:**
\`\`\`json
{
  "claimId": "uuid"
}
\`\`\`

**Response:**
\`\`\`json
{
  "claimId": "uuid",
  "recommendations": [
    {
      "scheme_id": "string",
      "scheme_name": "string", 
      "relevance_score": number,
      "eligibility_match": boolean,
      "reasoning": "string",
      "priority": "high|medium|low"
    }
  ],
  "totalSchemes": number,
  "highPriorityCount": number,
  "mediumPriorityCount": number,
  "lowPriorityCount": number,
  "generatedAt": "ISO string",
  "engineVersion": "string"
}
\`\`\`

#### Get Existing Recommendations
\`\`\`http
GET /functions/v1/generate-dss?claimId=<claim_id>
\`\`\`

### 3. Asset Mapping

#### Get Village Assets
\`\`\`http
GET /functions/v1/asset-mapping?village=<name>&district=<name>&state=<name>
\`\`\`

**Response:**
\`\`\`json
{
  "assets": [
    {
      "id": "uuid",
      "village_name": "string",
      "district": "string", 
      "state": "string",
      "asset_type": "agriculture|forest|water_body|homestead",
      "geojson": {},
      "source": "string",
      "last_updated": "ISO string"
    }
  ]
}
\`\`\`

#### Trigger AI Asset Detection
\`\`\`http
POST /functions/v1/asset-mapping
\`\`\`

**Request Body:**
\`\`\`json
{
  "action": "detect-assets",
  "coordinates": [minLon, minLat, maxLon, maxLat],
  "village": "string",
  "district": "string",
  "state": "string"
}
\`\`\`


**Response:**
\`\`\`json
{
  "assets": [
    {
      "type": "agriculture|forest|water_body|homestead",
      "confidence": number,
      "area": number,
      "coordinates": [[lon, lat], ...]
    }
  ],
  "totalArea": number,
  "saved": boolean
}
\`\`\`

#### Upload Manual Asset
\`\`\`http
POST /functions/v1/asset-mapping
\`\`\`

**Request Body:**
\`\`\`json
{
  "action": "manual-upload",
  "villageName": "string",
  "district": "string",
  "state": "string",
  "assetType": "agriculture|forest|water_body|homestead",
  "geoJson": {}
}
\`\`\`

### 4. Admin Dashboard

#### Get Dashboard Statistics
\`\`\`http
GET /functions/v1/admin-dashboard?action=dashboard&district=<name>&state=<name>
\`\`\`

**Response:**
\`\`\`json
{
  "stats": {
    "totalClaims": number,
    "pendingClaims": number,
    "approvedClaims": number,
    "rejectedClaims": number,
    "totalAssets": number,
    "totalUsers": number,
    "totalRecommendations": number,
    "claimsByType": {
      "IFR": number,
      "CR": number, 
      "CFR": number
    },
    "assetsByType": {
      "agriculture": number,
      "forest": number,
      "water_body": number,
      "homestead": number
    },
    "totalAreaClaimed": number
  },
  "recentActivities": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "action": "string",
      "metadata": {},
      "timestamp": "ISO string"
    }
  ]
}
\`\`\`

#### Get Claims List
\`\`\`http
GET /functions/v1/admin-dashboard?action=claims&page=1&limit=20&status=<status>
\`\`\`

**Response:**
\`\`\`json
{
  "claims": [
    {
      "id": "uuid",
      "user_id": "uuid", 
      "village_name": "string",
      "district": "string",
      "state": "string",
      "claim_type": "string",
      "area_hectares": number,
      "status": "string",
      "submitted_at": "ISO string",
      "profiles": {
        "full_name": "string",
        "email": "string"
      }
    }
  ],
  "page": number,
  "limit": number
}
\`\`\`

#### Approve/Reject Claim
\`\`\`http
PUT /functions/v1/admin-dashboard
\`\`\`

**Request Body:**
\`\`\`json
{
  "claimId": "uuid",
  "status": "approved|rejected",
  "adminNotes": "string"
}
\`\`\`

#### Bulk Process Claims
\`\`\`http
POST /functions/v1/admin-dashboard
\`\`\`

**Request Body:**
\`\`\`json
{
  "action": "bulk-process",
  "claimIds": ["uuid1", "uuid2"],
  "status": "approved|rejected",
  "adminNotes": "string"
}
\`\`\`

## Database Schema

### Tables

1. **profiles** - User profiles with roles
2. **fra_claims** - FRA claim submissions
3. **asset_maps** - Geospatial asset data (PostGIS)
4. **scheme_recommendations** - DSS recommendations
5. **logs** - Audit trail

### Storage Buckets

1. **fra-claims-docs** - Scanned documents
2. **fra-shapefiles** - Geospatial shapefiles
3. **asset-maps** - Asset imagery and tiles

## Government Schemes Database

The DSS engine includes these government schemes:

1. **PM-KISAN** - Agricultural income support
2. **Jal Jeevan Mission** - Water infrastructure
3. **MGNREGA** - Rural employment guarantee
4. **Pradhan Mantri Awas Yojana** - Housing scheme
5. **Forest Rights Act Support** - FRA implementation
6. **Krishak Bandhu** - Farmer assistance
7. **Soil Health Card** - Agricultural soil testing
8. **PMFBY** - Crop insurance

## Testing the Backend

### 1. Local Development Setup

1. **Install Dependencies:**
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

2. **Environment Variables:**
Create `.env.local` with:
\`\`\`
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

3. **Run Database Migrations:**
\`\`\`bash
# Using Supabase CLI
supabase db reset
supabase db push
\`\`\`

4. **Seed Test Data:**
\`\`\`bash
# Execute the seed.sql file in your Supabase dashboard
\`\`\`

### 2. API Testing with curl

#### Test Authentication:
\`\`\`bash
# First, sign up a test user via Supabase Auth
# Then use the JWT token for API calls

export JWT_TOKEN="your_jwt_token_here"
\`\`\`

#### Test Claim Upload:
\`\`\`bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/upload-claim' \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -F 'villageName=Test Village' \
  -F 'district=Bastar' \
  -F 'state=Chhattisgarh' \
  -F 'claimType=IFR' \
  -F 'areaHectares=1.5'
\`\`\`

#### Test DSS Generation:
\`\`\`bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/generate-dss' \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"claimId": "your-claim-id"}'
\`\`\`

#### Test Asset Detection:
\`\`\`bash
curl -X POST \
  'https://your-project.supabase.co/functions/v1/asset-mapping' \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "detect-assets",
    "coordinates": [81.9356, 20.2961, 81.9376, 20.2981],
    "village": "Test Village",
    "district": "Bastar",
    "state": "Chhattisgarh"
  }'
\`\`\`

### 3. Frontend Integration

Import the backend utilities:

\`\`\`typescript
import { supabase } from './lib/backend/supabaseClient'
import { DSSEngine } from './lib/backend/dssEngine'
import { AIProcessingService } from './lib/backend/aiConnectors'
\`\`\`

Example claim submission:
\`\`\`typescript
const handleClaimSubmission = async (formData: FormData) => {
  try {
    const response = await fetch('/functions/v1/upload-claim', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: formData
    })
    
    const result = await response.json()
    console.log('Claim submitted:', result)
  } catch (error) {
    console.error('Submission failed:', error)
  }
}
\`\`\`

### 4. Row Level Security Testing

Test RLS policies:

\`\`\`sql
-- As patta_holder, should only see own claims
SELECT * FROM fra_claims; 

-- As district_admin, should see claims in own district
SELECT * FROM fra_claims WHERE district = 'Bastar';

-- As super_admin, should see all claims
SELECT * FROM fra_claims;
\`\`\`

## Production Deployment

### Supabase Edge Functions Deployment

\`\`\`bash
# Deploy all functions
supabase functions deploy upload-claim
supabase functions deploy generate-dss
supabase functions deploy asset-mapping
supabase functions deploy admin-dashboard

# Set environment variables
supabase secrets set OCR_API_KEY=your_ocr_key
supabase secrets set CV_API_KEY=your_cv_key
\`\`\`

### Performance Considerations

1. **Database Indexing**: Ensure proper indexes on frequently queried columns
2. **Geospatial Queries**: Use PostGIS spatial indexes for asset queries
3. **File Storage**: Implement CDN for frequently accessed files
4. **API Rate Limiting**: Configure rate limits in Supabase
5. **Caching**: Implement Redis caching for DSS recommendations

## Monitoring & Analytics

### Key Metrics to Track

1. **Claim Processing Time**: Average time from submission to approval
2. **DSS Accuracy**: User feedback on recommendation relevance
3. **Asset Detection Confidence**: AI model performance metrics
4. **API Response Times**: Monitor endpoint performance
5. **Storage Usage**: Track document and shapefile storage growth

### Error Handling

All endpoints return structured error responses:

\`\`\`json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
\`\`\`

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Security Best Practices

1. **JWT Validation**: All endpoints validate JWT tokens
2. **Role-Based Access**: Strict role-based permissions
3. **Input Validation**: Sanitize all user inputs
4. **File Upload Security**: Validate file types and sizes
5. **SQL Injection Prevention**: Use parameterized queries
6. **CORS Configuration**: Proper CORS headers for web access

## Support & Troubleshooting

### Common Issues

1. **Token Expiry**: Implement token refresh logic
2. **CORS Errors**: Ensure proper CORS configuration
3. **PostGIS Errors**: Validate GeoJSON format
4. **Storage Permissions**: Check bucket policies
5. **Rate Limiting**: Implement retry logic with exponential backoff

### Debug Mode

Enable debug logging by setting environment variables:
\`\`\`
DEBUG_MODE=true
LOG_LEVEL=debug
\`\`\`

This comprehensive backend system provides a robust foundation for the FRA Atlas application with full CRUD operations, real-time capabilities, AI integration, and comprehensive administrative tools.
