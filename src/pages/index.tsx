import React from 'react'
import { GetServerSideProps } from 'next'
import supabase from 'libs/supabase'
import prisma from 'libs/prisma'

const IndexPage = (props) => {
  const { error } = props

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      {error && (
        <div className="mt-10">
          <span className="text-xl">{error}</span>
        </div>
      )}
    </div>
  )
}

export default IndexPage

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
    const publicUser = await prisma.user.findUnique({
      where: {
        userId: user.id,
      },
    })

    return {
      redirect: {
        destination: '/' + publicUser.role.toLowerCase(),
        permanent: false,
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something wrong in Fetching Data. Please try again',
      },
    }
  }
}
