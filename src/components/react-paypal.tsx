import { useState } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'

import { fetchPostJSON } from 'libs/api-helpers'

const ReactPayPal = (props) => {
  const { amount } = props
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState('')

  const createOrder = (data, actions) => {
    if (data) {
    }

    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: amount,
            },
          },
        ],
        // remove the applicaiton_context object if you need your users to add a shipping address
        application_context: {
          shipping_preference: 'NO_SHIPPING',
        },
      })
      .then((orderID) => {
        return orderID
      })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const { payer } = details
      if (payer) {
      }
      setSucceeded(true)
      updateOrderDB(data)
    })
  }

  const onError = (err) => {
    console.log('paypal payment error: ', err)
    setError('Something went wrong with your payment')
  }

  const updateOrderDB = async (data) => {
    const newOrder = localStorage.getItem('order')
    const newOrderDetails = localStorage.getItem('orderDetails')

    if (newOrder) {
      const order = JSON.parse(newOrder)
      const orderWithPayment = {
        ...order,
        paypalOrderId: data.orderID,
        paypalPayerId: data.payerID,
      }

      fetchPostJSON('/api/createOrder', {
        order: orderWithPayment,
      })
        .then(async (res) => {
          // console.log('create order res', res)
          if (res.error) {
            // console.log('update order error', res.error)
            setError(res.error)
          } else if (newOrderDetails) {
            let orderDetailsWithOrderId = []
            const orderDetails = JSON.parse(newOrderDetails)
            orderDetails.forEach((e) => orderDetailsWithOrderId.push({ ...e, orderId: res.id }))
            await fetchPostJSON('/api/createOrderDetails', {
              orderDetails: orderDetailsWithOrderId,
            })

            localStorage.removeItem('order')
            localStorage.removeItem('orderDetails')
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  return (
    <div className="">
      <PayPalButtons
        style={{
          color: 'blue',
          shape: 'rect',
          label: 'pay',
          tagline: false,
          layout: 'horizontal',
          height: 44,
        }}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
      />
      {succeeded && <span className="text-green-700">Payment Success!</span>}
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  )
}

export default ReactPayPal
