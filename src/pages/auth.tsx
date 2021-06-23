import { useState, useEffect } from 'react'
import { Auth } from '@supabase/ui'
import supabase from 'libs/supabase'
import Router from 'next/router'

type ViewType = 'sign_in' | 'sign_up' | 'forgotten_password' | 'magic_link' | 'update_password'

const AuthPage = () => {
  const [authView, setAuthView] = useState<ViewType>('sign_in')

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      //send session to /api/auth to set the auth cookie
      //this is only needed if you're doing SSR(getServerSideProps)!
      fetch('/api/setAuthCookie', {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json())

      if (event === 'PASSWORD_RECOVERY') setAuthView('update_password')
      if (event === 'USER_UPDATED') setTimeout(() => setAuthView('sign_in'), 1000)
      if (event === 'SIGNED_IN') Router.push('/')
      if(event === 'SIGNED_OUT') Router.push('/auth')
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <div className="relative w-screen h-screen flex justify-center items-center">
      <div className="relative w-full h-full">
        <img src="/background.svg" alt="background" className="object-cover w-full h-full" />
        <div className="absolute inset-0 w-full bg-gray-200 opacity-50"></div>
      </div>
      <div className="absolute w-full md:w-1/3 p-6 md:px-24 bg-white opacity-90 shadow rounded-lg border">
        <div className="flex justify-center items-center my-10">
          <img src="/logo.svg" alt="logo" className="w-14 h-14" />
          <span className="text-lg">Welcome to Lounge</span>
        </div>
        {authView === 'update_password' && <Auth.UpdatePassword supabaseClient={supabase} />}
        {authView !== 'update_password' && (
          <Auth
            supabaseClient={supabase}
            providers={['google']}
            view={authView}
            socialLayout="horizontal"
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage
