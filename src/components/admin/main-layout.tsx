import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from 'libs/supabase'

import Loading from 'components/loading'

const MainLayout = (props) => {
  const router = useRouter()
  const { pathname } = router

  const menu = [
    {
      name: 'Reservations',
      icon: '/icons/menu_reservations.svg',
      path: '/admin/reservations',
    },
    {
      name: 'Reports',
      icon: '/icons/menu_reports.svg',
      path: '/admin/reports',
    },
    {
      name: 'Packages',
      icon: '/icons/menu_products.svg',
      path: '/admin/packages',
    },
    {
      name: 'Products',
      icon: '/icons/menu_products.svg',
      path: '/admin/products',
    },
    {
      name: 'Guests',
      icon: '/icons/menu_guests.svg',
      path: '/admin/guests',
    },
    {
      name: 'Servers',
      icon: '/icons/menu_servers.svg',
      path: '/admin/servers',
    },
    {
      name: 'Setting',
      icon: '/icons/menu_setting.svg',
      path: '/admin/setting',
    },
  ]
  const activeMenu = menu.find((item) => pathname.includes(item.path))

  const [loading, setLoading] = useState(false)
  const onClickMenu = (path) => {
    setLoading(true)
    router.push(path)
  }

  const onLogout = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    console.log('signout', error)
    setLoading(false)
  }

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

      if (event === 'SIGNED_OUT') router.push('/auth')
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [])

  return (
    <div className="flex">
      <Loading loading={loading} />
      {/* menu */}
      <div className="w-72 h-full flex flex-col items-center">
        <img
          src="/logo.svg"
          onClick={() => {
            router.push('/')
          }}
          className="w-2/3 my-6 cursor-pointer"
        />
        <section className="w-full mt-6">
          {menu.map((item, index) => {
            return (
              <div key={index} onClick={() => onClickMenu(item.path)}>
                <div
                  className={`flex items-center ${
                    activeMenu?.name === item.name ? 'border-r-2' : ''
                  } border-blue-700 cursor-pointer ml-6 mt-10`}
                >
                  <img src={item.icon} className="w-8 h-8" alt="icon" />
                  <span
                    className={`${
                      activeMenu?.name === item.name ? 'text-blue-700' : 'text-gray-500'
                    } hover:text-blue-500 font-semibold ml-3`}
                  >
                    {item.name}
                  </span>
                </div>
              </div>
            )
          })}
        </section>
        <div className="fixed bottom-10 flex cursor-pointer" onClick={onLogout}>
          <img src="/icons/logout.svg" alt="logout" className="w-6" />
          <span className="text-md font-semibold mx-2">Log out</span>
        </div>
      </div>

      {/* body */}
      <div className="w-full min-h-screen bg-gray-100">{props.children}</div>
    </div>
  )
}

export default MainLayout
