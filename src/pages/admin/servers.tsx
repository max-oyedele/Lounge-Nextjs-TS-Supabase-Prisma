import React, { useState } from 'react'

import { GetServerSideProps } from 'next'
import supabase from 'libs/supabase'
import prisma from 'libs/prisma'

import MainLayout from 'components/admin/main-layout'
import Logo from 'components/admin/logo'
import SearchBox from 'components/admin/searchbox'
import { ServerTable } from 'components/admin/tables/server-tables'

const Servers = (props) => {
  const { users } = props
  const [selectedKeyword, setSelectedKeyword] = useState()
  console.log('asdf', users)

  return (
    <MainLayout>
      <Logo />

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 px-10 mt-6">
        <div className="flex items-center py-2">
          <div className="w-full border border-gray-400 rounded-lg">
            <SearchBox selectedKeyword={selectedKeyword} setSelectedKeyword={setSelectedKeyword} />
          </div>
        </div>
      </div>

      <div className="p-10">
        <ServerTable users={users} selectedKeyword={selectedKeyword} />
      </div>
    </MainLayout>
  )
}

export default Servers

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { user } = await supabase.auth.api.getUserByCookie(req)
  if (!user) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    }
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'SERVER',
      },
    })

    const publicUser = await prisma.user.findUnique({
      where: {
        userId: user.id,
      },
    })
    if (publicUser.role !== 'ADMIN') {
      return {
        redirect: {
          destination: '/' + publicUser.role.toLowerCase(),
          permanent: false,
        },
      }
    }

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something wrong in Server. Please try again',
      },
    }
  }
}
