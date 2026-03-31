// Quick test to check Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pruqwhqviksiklgzvfps.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBydXF3aHF2aWtzaWtsZ3p2ZnBzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMzk2MjksImV4cCI6MjA3NTcxNTYyOX0.F1m0OOZWEza5J5msAZiH31RCceQlv2Z2M92VKNq_o4s'

const supabase = createClient(supabaseUrl, supabaseKey)

// Test products table
supabase.from('products').select('*').then(({ data, error }) => {
  if (error) {
    console.error('Supabase Error:', error)
  } else {
    console.log('Products:', data)
  }
})
