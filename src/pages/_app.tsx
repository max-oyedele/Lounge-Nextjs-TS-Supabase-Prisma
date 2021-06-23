import React from 'react'

import { AppProps } from 'next/app'

import { Auth } from '@supabase/ui'
import supabase from 'libs/supabase'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'

import '../styles/global.css'

const initialOptions = {
  "client-id": "AXBwtg1zll4vpZ8LXQzs4KEcaEiFBgzJ73QrIUwnsaHbPVDFTBVDVXj49NgyHE5Em5UA0X2dtmcWkuwm",
  currency: "USD",
  intent: "capture"
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <PayPalScriptProvider options={initialOptions}>
        <Component {...pageProps} />
      </PayPalScriptProvider>
    </Auth.UserContextProvider>
  )
}
