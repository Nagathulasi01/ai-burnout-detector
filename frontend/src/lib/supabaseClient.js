import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://izcggaieqjgodxphwyln.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Y2dnYWllcWpnb2R4cGh3eWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMzk0NjUsImV4cCI6MjA5NTcxNTQ2NX0.Y43DRmtAWQcjBEm9PhLXq92dgdl-xieqNMTQO32m8xU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);