import React, { useState } from 'react'

import { GetServerSideProps } from 'next'
import supabase from 'libs/supabase'
import prisma from 'libs/prisma'

import MainLayout from 'components/admin/main-layout'
import Logo from 'components/admin/logo'
import SearchBox from 'components/admin/searchbox'
import { PackageTable } from 'components/admin/tables/package-tables'

const Packages = (props) => {
  const { users, packages, packagesProducts, products } = props
  const [selectedKeyword, setSelectedKeyword] = useState()

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
        <PackageTable users={users} packages={packages} packagesProducts={packagesProducts} products={products} selectedKeyword={selectedKeyword} />
      </div>
    </MainLayout>
  )
}

export default Packages

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
    const adminUser = users?.find(
      (userItem) => userItem.userId == user.id.toString() && userItem.role === 'ADMIN',
    )

    if (!adminUser) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const packages = await prisma.package.findMany()
    const packagesProducts = await prisma.packageProduct.findMany({
      include: {
        package: true,
        product: true
      }
    })
    const products = await prisma.product.findMany()

    return {
      props: {
        users: JSON.parse(JSON.stringify(users)),
        packages: JSON.parse(JSON.stringify(packages)),
        packagesProducts: JSON.parse(JSON.stringify(packagesProducts)),
        products: JSON.parse(JSON.stringify(products)),
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something wrong in Package. Please try again',
      },
    }
  }
}
