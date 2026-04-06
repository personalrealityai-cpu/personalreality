import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wosnmhmsgnjsurzdezxv.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvc25taG1zZ25qc3VyemRlenh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MTEzNTcsImV4cCI6MjA4OTM4NzM1N30.wuecTknSEYu28u1P5XfgPreYPxATfLuaVfUBB1dJ-Jc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;