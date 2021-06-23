import { createClient } from '@supabase/supabase-js'
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  publicRuntimeConfig.SUPABASE_ANON_KEY
)

export default supabase