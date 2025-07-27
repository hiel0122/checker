import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cgoxmzqaoqjyagamvwoq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnb3htenFhb3FqeWFnYW12d29xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MDE2OTgsImV4cCI6MjA2OTE3NzY5OH0.FBqsDSdtgMCXPdyfKK_SIsdilIYaJDyRhtLMxbTkbHg'

export const supabase = createClient(supabaseUrl, supabaseKey)