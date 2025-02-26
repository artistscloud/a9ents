
import { createClient } from '@supabase/supabase-js'
import { Database } from './types'

const supabaseUrl = 'https://mgrcrlhwyxhttgfhuvbv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmNybGh3eXhodHRnZmh1dmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1OTE3OTksImV4cCI6MjA1NjE2Nzc5OX0.j9uewX8f-ClbaRRcgXGf9KB1GuP_zHWy82VLE0C2d2w'

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)
