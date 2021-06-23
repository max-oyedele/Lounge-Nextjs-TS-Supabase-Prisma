import React, { useState } from 'react'

import { GetServerSideProps } from 'next'
import supabase from 'libs/supabase'
import prisma from 'libs/prisma'

import MainLayout from 'components/admin/main-layout'
import Logo from 'components/admin/logo'
import SearchBox from 'components/admin/searchbox'
import CDatePicker from 'components/datepicker'
import { ReservationTable } from 'components/admin/tables/reservation-tables'

const Reservations = (props) => {
  const { users, sections, packages, orders, productOptions } = props
  const [selectedKeyword, setSelectedKeyword] = useState()
  const [selectedDate, setSelectedDate] = useState()

  return (
    <MainLayout>
      <Logo />

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 px-10 mt-6">
        <div className="flex items-center py-2">
          <div className="w-full border border-gray-400 rounded-lg">
            <SearchBox selectedKeyword={selectedKeyword} setSelectedKeyword={setSelectedKeyword} />
          </div>
        </div>
        <div className="w-2/3 flex items-center py-2">
          <CDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
      </div>

      <div className="px-10">
        <ReservationTable
          users={users}
          sections={sections}
          packages={packages}
          orders={orders}
          productOptions={productOptions}
          selectedKeyword={selectedKeyword}
          selectedDate={selectedDate}
        />
      </div>
    </MainLayout>
  )
}

export default Reservations

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
    const users = await prisma.user.findMany()
    const adminUser = users?.find((userItem) => userItem.userId == user.id.toString() && userItem.role === 'ADMIN')

    if (!adminUser) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const sections = await prisma.section.findMany()
    const packages = await prisma.package.findMany({
      include: {
        packageProducts: {
          include: {
            product: {
              include: {
                options: true,
              },
            },
          },
        },
      },
    })
    const orders = await prisma.order.findMany({
      where: {
        userId: {
          gt: 0,
        },
        serverId: null,
      },
      include: {
        orderDetails: true,
      },
    })
    const productOptions = await prisma.productOption.findMany()

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        packages: JSON.parse(JSON.stringify(packages)),
        sections: JSON.parse(JSON.stringify(sections)),
        orders: JSON.parse(JSON.stringify(orders)),
        productOptions: JSON.parse(JSON.stringify(productOptions))
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something wrong in Reservation. Please try again',
      },
    }
  }
}
