import React, { useState } from 'react'

import { GetServerSideProps } from 'next'
import supabase from 'libs/supabase'
import prisma from 'libs/prisma'

import MainLayout from 'components/server/main-layout'
import Logo from 'components/server/logo'
import Avatar from 'components/avatar'
import SearchBox from 'components/admin/searchbox'
import CDatePicker from 'components/datepicker'
import { MySalesTable, InventoryTable } from 'components/server/tables/myview-tables'

const MyView = (props) => {
  const { users, server, sections, packages, products, orders, orderDetails } = props
  const [selectedKeyword, setSelectedKeyword] = useState()
  const [selectedDate, setSelectedDate] = useState()

  return (
    <MainLayout>
      <Logo />
      <Avatar />

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

      <div className="p-10 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <MySalesTable
            users={users}
            server={server}
            sections={sections}
            packages={packages}
            products={products}
            orders={orders}
            orderDetails={orderDetails}
            selectedKeyword={selectedKeyword}
            selectedDate={selectedDate}
          />
        </div>
        <div className="md:col-span-1">
          <InventoryTable
            users={users}
            sections={sections}
            packages={packages}
            products={products}
            orders={orders}
            orderDetails={orderDetails}
            selectedKeyword={selectedKeyword}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </MainLayout>
  )
}

export default MyView

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
    const serverUser = users?.find(
      (userItem) => userItem.userId == user.id.toString() && userItem.role === 'SERVER',
    )

    if (!serverUser) {
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
    const products = await prisma.product.findMany({
      include: {
        options: true,
      },
    })
    const orders = await prisma.order.findMany({
      include: {
        orderDetails: true,
      },
      where: {
        serverId: serverUser.id
      }
    })
    const orderDetails = await prisma.orderDetail.findMany()

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        server: JSON.parse(JSON.stringify(serverUser)),
        sections: JSON.parse(JSON.stringify(sections)),
        packages: JSON.parse(JSON.stringify(packages)),
        products: JSON.parse(JSON.stringify(products)),
        orders: JSON.parse(JSON.stringify(orders)),
        orderDetails: JSON.parse(JSON.stringify(orderDetails)),
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something wrong in MyView. Please try again',
      },
    }
  }
}
