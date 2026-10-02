import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://swqtwrmmhskfchflvrxo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInRlZiI6InN3cXR3cm1taHNrZmNoZmx2cnhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA5NjI3MTAsImV4cCI6MjEwNjUzODcxMH0.tOCKBXFseW9QhDHJT5r3-FTNKL0zhZh2vPQZ4n4a3x0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
