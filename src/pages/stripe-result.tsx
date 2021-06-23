import { useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import { fetchGetJSON, fetchPostJSON } from 'libs/api-helpers'

const StripeResultPage: NextPage = () => {
  const router = useRouter()

  // Fetch CheckoutSession from static page via
  // https://nextjs.org/docs/basic-features/data-fetching#static-generation
  const { data, error } = useSWR(
    router.query.session_id ? `/api/checkout_sessions/${router.query.session_id}` : null,
    fetchGetJSON,
  )

  const [dbError, setDbError] = useState()

  if (data?.payment_status === 'paid') {
    const newOrder = localStorage.getItem('order')
    const newOrderDetails = localStorage.getItem('orderDetails')

    if (newOrder) {
      const order = JSON.parse(newOrder)
      const orderWithPayment = {
        ...order,
        stripePaymentId: data.id,
        stripeCustomer: data.customer_details?.email,
      }
      
      fetchPostJSON('/api/createOrder', {
        order: orderWithPayment,
      })
      .then(async (res) => {
        // console.log('create order res', res)
        if (res.error) {
          setDbError(res.error)
        } else if (newOrderDetails) {
            let orderDetailsWithOrderId = []
            const orderDetails = JSON.parse(newOrderDetails)
            orderDetails.forEach((e) => orderDetailsWithOrderId.push({ ...e, orderId: res.id }))
            await fetchPostJSON('/api/createOrderDetails', {
              orderDetails: orderDetailsWithOrderId,
            })

            localStorage.removeItem('order')
            localStorage.removeItem('orderDetails')

            // await fetch('/api/mail', {
            //   method: 'POST',
            //   body: JSON.stringify({content: 'your order'})
            // });

            router.push('/guest')
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  return (
    <div className="">
      {/* <h1>Checkout Payment Result</h1>
      <h2>Status: {data?.payment_intent?.status ?? 'loading...'}</h2>
      <h3>CheckoutSession response:</h3>
      <pre>{JSON.stringify(data ?? 'loading', null, 2)}</pre> */}
      {error && error}
      {dbError && dbError}
    </div>
  )
}

export default StripeResultPage
