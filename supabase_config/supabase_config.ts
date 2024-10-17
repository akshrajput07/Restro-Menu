// utils/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://isiasceawhqsojrvzdrt.supabase.co';  // Replace with your Supabase URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzaWFzY2Vhd2hxc29qcnZ6ZHJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNzkyMDgsImV4cCI6MjA0NDc1NTIwOH0.NpbztEUj2bXiym3rj2KARw-WY3CX-xX7bnaHu0DVBME';  // Replace with your Supabase Anon Key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);