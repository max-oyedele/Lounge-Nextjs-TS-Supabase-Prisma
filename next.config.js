require('dotenv').config()

const bundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: !!process.env.BUNDLE_ANALYZE,
})

const ENV_VARS = {
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
}

module.exports = bundleAnalyzer({
  // will be available during the build time
  env: ENV_VARS,

  // serverRuntimeConfig: ... <- will only be available on the server side
  
  // will be available on both server and client
  publicRuntimeConfig: ENV_VARS,
  poweredByHeader: false
})
