import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://liezdebhrijjvxekpnms.supabase.co';
const supabaseKey = 'sb_publishable_rlOVOrYlm6XX5PqItDMDuA_uOiEsIq3';

export const supabase = createClient(supabaseUrl, supabaseKey);