import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { GetServerSideProps } from 'next'
import supabase from 'libs/supabase'
import prisma from 'libs/prisma'

import getStripe from 'libs/get-stripejs'
import { fetchPostJSON } from 'libs/api-helpers'

import CDatePicker from 'components/datepicker'
import SectionCard from 'components/section-card'
import PackageCard from 'components/package-card'
import TicketCard from 'components/ticket-card'
import Modal from 'components/modal'
import Loading from 'components/loading'

const IndexPage = (props) => {
  const { user, sections, packages, productOptions, orders, error } = props

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [selectedPeople, setSelectedPeople] = useState()
  const [selectedProductOptionIds, setSelectedProductOptionIds] = useState([])

  const [validReserved, setValidReserved] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)

  const isReserved = (section) => {
    const date = moment(selectedDate).format('yyyy-MM-DD')
    const ordersForSelectedDate = orders.filter((e) => moment(e.date).isSame(date))
    const reserved = ordersForSelectedDate.findIndex((e) => e.sectionId === section.id) > -1
    return reserved
  }

  useEffect(() => {
    if (selectedSection && selectedPackage) {
      setValidReserved(true)
    }
  }, [selectedSection, selectedPackage])

  const [loading, setLoading] = useState(false)
  const [orderDetails, setOrderDetails] = useState([])

  const onMakePayment = () => {
    if (validReserved) {
      const newOrder = {
        userId: user.id,
        sectionId: selectedSection?.id,
        packageId: selectedPackage?.id,
        people: selectedPeople,
        date: moment(selectedDate).format('yyyy-MM-DD'),
        price: selectedPackage?.price + (selectedPackage?.price * selectedPackage?.gratuity) / 100,
      }

      let newOrderDetails = []
      selectedProductOptionIds.forEach((id) => {
        newOrderDetails.push({
          productId: productOptions?.find((e) => e.id === id)?.productId,
          productOptionId: id,
          productOptionAmount: 1,
        })
      })

      setOrderDetails(newOrderDetails)
      setConfirmModal(true)

      localStorage.setItem('order', JSON.stringify(newOrder))
      localStorage.setItem('orderDetails', JSON.stringify(newOrderDetails))
    }
  }

  const paymentWithStripe = async (amount) => {
    setLoading(true)

    // Create a Checkout Session.
    const response = await fetchPostJSON('/api/checkout_sessions', {
      amount: amount,
    })

    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }
    // Redirect to Checkout.
    const stripe = await getStripe()
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: response.id,
    })
    // If `redirectToCheckout` fails due to a browser or network
    // error, display the localized error message to your customer
    // using `error.message`.
    console.warn(error.message)
    setLoading(false)
  }

  return (
    <div className="w-screen flex flex-col items-center">
      <div className="relative w-full h-64 flex justify-center items-center">
        <img src="/background.svg" className="object-cover w-full h-full" alt="background" />
        <span className="absolute text-white text-4xl">Welcome to Barand Lounge!</span>
      </div>
      {loading && <Loading loading={loading} />}
      {error && (
        <div className="mt-10">
          <span className="text-xl">{error}</span>
        </div>
      )}

      {!error && (
        <div className="w-full max-w-7xl flex flex-col items-center p-6">
          <div className="flex justify-center items-center mt-4 p-2">
            <CDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} minDate={new Date()} />
          </div>
          <div className="grid grid-cols-3 gap-x-6 mt-10">
            {sections.map((section, index) => (
              <SectionCard
                key={index}
                section={section}
                reserved={isReserved(section)}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 mt-16">
            {packages.map((packageItem, index) => (
              <PackageCard
                key={index}
                packageItem={packageItem}
                selectedPackage={selectedPackage}
                setSelectedPackage={setSelectedPackage}
                selectedPeople={selectedPeople}
                setSelectedPeople={setSelectedPeople}
                selectedProductOptionIds={[...selectedProductOptionIds]}
                setSelectedProductOptionIds={setSelectedProductOptionIds}
              />
            ))}
          </div>

          <div className="flex flex-col items-center mt-12">
            <button
              className={`w-72 bg-green-700 hover:bg-green-500 rounded-lg p-4 text-xl text-white font-bold ${
                !validReserved ? 'cursor-not-allowed' : ''
              }`}
              onClick={onMakePayment}
            >
              Purchase
            </button>
          </div>

          {confirmModal && (
            <Modal setOpenModal={setConfirmModal}>
              <TicketCard
                user={user}
                selectedDate={selectedDate}
                selectedSection={selectedSection}
                selectedPackage={selectedPackage}
                selectedPeople={selectedPeople}
                orderDetails={orderDetails}
                setConfirmModal={setConfirmModal}
                paymentWithStripe={paymentWithStripe}
              />
            </Modal>
          )}
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

    if (publicUser.role !== 'GUEST') {
      return {
        redirect: {
          destination: '/' + publicUser.role.toLowerCase(),
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
    const productOptions = await prisma.productOption.findMany()
    const orders = await prisma.order.findMany()

    return {
      props: {
        user: JSON.parse(JSON.stringify(publicUser)),
        sections: JSON.parse(JSON.stringify(sections)),
        packages: JSON.parse(JSON.stringify(packages)),
        productOptions: JSON.parse(JSON.stringify(productOptions)),
        orders: JSON.parse(JSON.stringify(orders)),
      },
    }
  } catch (err) {
    return {
      props: {
        error: 'Something wrong in Guest. Please try again',
      },
    }
  }
}
