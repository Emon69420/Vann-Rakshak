-- Enable PostGIS extension for geospatial data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enums for various types
CREATE TYPE public.user_role AS ENUM ('patta_holder', 'district_admin', 'state_admin', 'super_admin');
CREATE TYPE public.claim_type AS ENUM ('IFR', 'CR', 'CFR');
CREATE TYPE public.claim_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.asset_type AS ENUM ('agriculture', 'forest', 'water_body', 'homestead');

-- Create users/profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'patta_holder',
  district TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create FRA claims table
CREATE TABLE public.fra_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  village_name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  claim_type claim_type NOT NULL,
  area_hectares NUMERIC(10,2) NOT NULL CHECK (area_hectares > 0),
  status claim_status DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES public.profiles(id),
  shapefile_url TEXT,
  document_url TEXT,
  metadata_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create asset maps table with PostGIS geometry
CREATE TABLE public.asset_maps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  village_name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  asset_type asset_type NOT NULL,
  geojson GEOMETRY(POLYGON, 4326),
  map_tile_url TEXT,
  source TEXT DEFAULT 'manual',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheme recommendations table
CREATE TABLE public.scheme_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fra_claim_id UUID REFERENCES public.fra_claims(id) ON DELETE CASCADE NOT NULL,
  recommended_schemes JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  engine_version TEXT DEFAULT 'v1'
);

-- Create logs table for audit trail
CREATE TABLE public.logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fra_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.asset_maps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for FRA claims
CREATE POLICY "Users can view their own claims"
  ON public.fra_claims FOR SELECT
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('district_admin', 'state_admin', 'super_admin')
    )
  );

CREATE POLICY "Users can create their own claims"
  ON public.fra_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own claims or admins can update any"
  ON public.fra_claims FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('district_admin', 'state_admin', 'super_admin')
    )
  );

-- RLS Policies for asset maps (readable by all authenticated users)
CREATE POLICY "Authenticated users can view asset maps"
  ON public.asset_maps FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert asset maps"
  ON public.asset_maps FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('district_admin', 'state_admin', 'super_admin')
    )
  );

-- RLS Policies for scheme recommendations
CREATE POLICY "Users can view recommendations for their claims"
  ON public.scheme_recommendations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.fra_claims c 
      WHERE c.id = fra_claim_id 
      AND (c.user_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM public.profiles p 
             WHERE p.id = auth.uid() 
             AND p.role IN ('district_admin', 'state_admin', 'super_admin')
           ))
    )
  );

CREATE POLICY "System can insert recommendations"
  ON public.scheme_recommendations FOR INSERT
  WITH CHECK (true);

-- RLS Policies for logs (admins only)
CREATE POLICY "Admins can view all logs"
  ON public.logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('state_admin', 'super_admin')
    )
  );

CREATE POLICY "System can insert logs"
  ON public.logs FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_fra_claims_user_id ON public.fra_claims(user_id);
CREATE INDEX idx_fra_claims_district ON public.fra_claims(district);
CREATE INDEX idx_fra_claims_status ON public.fra_claims(status);
CREATE INDEX idx_asset_maps_village ON public.asset_maps(village_name, district);
CREATE INDEX idx_asset_maps_type ON public.asset_maps(asset_type);
CREATE INDEX idx_logs_user_id ON public.logs(user_id);
CREATE INDEX idx_logs_action ON public.logs(action);

-- Create spatial index for geojson column
CREATE INDEX idx_asset_maps_geojson ON public.asset_maps USING GIST(geojson);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fra_claims_updated_at
  BEFORE UPDATE ON public.fra_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('fra-claims-docs', 'FRA Claims Documents', false),
  ('fra-shapefiles', 'FRA Shapefiles', false),
  ('asset-maps', 'Asset Maps', false);

-- Storage policies for fra-claims-docs bucket
CREATE POLICY "Users can upload their own claim documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'fra-claims-docs' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own claim documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'fra-claims-docs' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (
       SELECT 1 FROM public.profiles p 
       WHERE p.id = auth.uid() 
       AND p.role IN ('district_admin', 'state_admin', 'super_admin')
     ))
  );

-- Storage policies for fra-shapefiles bucket
CREATE POLICY "Users can upload their own shapefiles"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'fra-shapefiles' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own shapefiles"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'fra-shapefiles' AND
    (auth.uid()::text = (storage.foldername(name))[1] OR
     EXISTS (
       SELECT 1 FROM public.profiles p 
       WHERE p.id = auth.uid() 
       AND p.role IN ('district_admin', 'state_admin', 'super_admin')
     ))
  );

-- Storage policies for asset-maps bucket
CREATE POLICY "Authenticated users can view asset maps"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'asset-maps');

CREATE POLICY "Admins can upload asset maps"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'asset-maps' AND
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.id = auth.uid() 
      AND p.role IN ('district_admin', 'state_admin', 'super_admin')
    )
  );
