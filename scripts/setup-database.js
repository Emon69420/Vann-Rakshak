import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://omatcnxdwftllnemhfeh.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYXRjbnhkd2Z0bGxuZW1oZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDQ0NzAsImV4cCI6MjA3Mzc4MDQ3MH0.DnpylNbkAl5n9UOVwXCG4l1p7cz_k8eDaMl_U-oZlDg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔗 Testing Supabase connection...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      
      // If profiles table doesn't exist, that's expected before migration
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('✅ Connection successful! Database schema needs to be set up.')
        return true
      }
      return false
    }
    
    console.log('✅ Connection successful!')
    console.log('📊 Database is ready to use')
    return true
  } catch (err) {
    console.error('❌ Connection error:', err)
    return false
  }
}

async function setupDatabase() {
  console.log('\n🔧 Setting up database schema...')
  
  // Note: For production, you should use Supabase CLI migrations
  // This is a simplified setup for development
  
  const migrationSQL = `
    -- Enable PostGIS extension for geospatial data
    CREATE EXTENSION IF NOT EXISTS postgis;
    
    -- Create enums for various types
    DO $$ BEGIN
      CREATE TYPE public.user_role AS ENUM ('patta_holder', 'district_admin', 'state_admin', 'super_admin');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    DO $$ BEGIN
      CREATE TYPE public.claim_type AS ENUM ('IFR', 'CR', 'CFR');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    DO $$ BEGIN
      CREATE TYPE public.claim_status AS ENUM ('pending', 'approved', 'rejected');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
    
    DO $$ BEGIN
      CREATE TYPE public.asset_type AS ENUM ('agriculture', 'forest', 'water_body', 'homestead');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `
  
  try {
    console.log('📝 Creating database types...')
    console.log('\n⚠️  Manual Setup Required:')
    console.log('Please run the following in your Supabase SQL editor:')
    console.log('1. Go to https://supabase.com/dashboard/project/omatcnxdwftllnemhfeh/sql')
    console.log('2. Copy and paste the migration SQL from supabase/migrations/20250918142303_c2836e62-761a-48ad-a0bb-a143ab2680d8.sql')
    console.log('3. Click "Run" to execute the migration')
    console.log('4. Then run the seed data from supabase/seed.sql')
    
    return true
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    return false
  }
}

async function checkTables() {
  console.log('\n🔍 Checking database tables...')
  
  const tables = ['profiles', 'fra_claims', 'asset_maps', 'scheme_recommendations', 'logs']
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        console.log(`❌ Table '${table}' not found`)
      } else {
        console.log(`✅ Table '${table}' exists`)
      }
    } catch (err) {
      console.log(`❌ Table '${table}' check failed`)
    }
  }
}

async function main() {
  console.log('🚀 FRA Atlas Database Setup')
  console.log('=====================================\n')
  
  const connected = await testConnection()
  
  if (connected) {
    await checkTables()
    await setupDatabase()
    
    console.log('\n📋 Next Steps:')
    console.log('1. Set up the database schema manually in Supabase dashboard')
    console.log('2. Run: node scripts/test-backend.js')
    console.log('3. Start the development server: npm run dev')
    console.log('\n🎉 Setup complete!')
  } else {
    console.log('\n❌ Setup failed - please check your Supabase credentials')
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { testConnection, setupDatabase, checkTables }
//suman 
