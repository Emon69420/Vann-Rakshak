const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = 'https://omatcnxdwftllnemhfeh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tYXRjbnhkd2Z0bGxuZW1oZmVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMDQ0NzAsImV4cCI6MjA3Mzc4MDQ3MH0.DnpylNbkAl5n9UOVwXCG4l1p7cz_k8eDaMl_U-oZlDg'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🚀 FRA Atlas - Testing Supabase Connection')
  console.log('=' .repeat(50))
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')
  console.log('')
  
  try {
    // Test 1: Basic connection
    console.log('📡 Testing basic connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      if (error.message.includes('relation "public.profiles" does not exist')) {
        console.log('✅ Connection successful! (Tables not yet created)')
        console.log('')
        console.log('📋 SETUP REQUIRED:')
        console.log('1. Go to: https://supabase.com/dashboard/project/omatcnxdwftllnemhfeh/sql')
        console.log('2. Copy the SQL from: supabase/migrations/20250918142303_c2836e62-761a-48ad-a0bb-a143ab2680d8.sql')
        console.log('3. Paste and run in the SQL editor')
        console.log('4. Then run the seed data from: supabase/seed.sql')
        console.log('')
      } else {
        console.log('❌ Connection failed:', error.message)
        return false
      }
    } else {
      console.log('✅ Connection successful! Database is ready.')
      console.log('')
    }
    
    // Test 2: Try to access storage
    console.log('💾 Testing storage access...')
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
      if (storageError) {
        console.log('⚠️  Storage not accessible:', storageError.message)
      } else {
        console.log(`✅ Storage accessible (${buckets?.length || 0} buckets found)`)
      }
    } catch (storageErr) {
      console.log('⚠️  Storage test failed:', storageErr.message)
    }
    
    console.log('')
    console.log('🎯 NEXT STEPS:')
    console.log('1. Set up database schema (see instructions above)')
    console.log('2. Test your frontend: npm run dev')
    console.log('3. Create a user account through the app')
    console.log('4. Test backend APIs')
    console.log('')
    console.log('📚 Documentation: docs/backend-api.md')
    console.log('🎉 Your FRA Atlas backend is ready to go!')
    
    return true
    
  } catch (err) {
    console.log('❌ Connection error:', err.message)
    return false
  }
}

// Additional utility functions
async function checkTablesExist() {
  const tables = ['profiles', 'fra_claims', 'asset_maps', 'scheme_recommendations', 'logs']
  console.log('\n🔍 Checking database tables...')
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1)
      
      if (error) {
        console.log(`❌ ${table}: Not found`)
      } else {
        console.log(`✅ ${table}: Ready`)
      }
    } catch (err) {
      console.log(`❌ ${table}: Error`)
    }
  }
}

async function showProjectInfo() {
  console.log('\n📊 PROJECT INFORMATION:')
  console.log('Project: FRA Atlas + Decision Support System')
  console.log('Backend: Supabase with PostGIS')
  console.log('Features: AI-powered claim processing, geospatial asset mapping, recommendation engine')
  console.log('')
}

// Run the test
testConnection().then(async (success) => {
  if (success) {
    await checkTablesExist()
    await showProjectInfo()
  }
}).catch(console.error)

