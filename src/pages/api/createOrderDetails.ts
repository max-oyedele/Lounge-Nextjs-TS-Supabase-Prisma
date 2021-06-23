import prisma from 'libs/prisma'

export default async function handler(req, res) {
  const { orderDetails } = req.body
  Promise.all(
    orderDetails.map(async (orderDetail) => {
      await prisma.orderDetail.create({
        data: orderDetail,
      })
    }),
  )
    .then(() => {
      res.status(200).json({ success: 'OK' })
    })
    .catch((err) => {
      console.log('create order details error:', err)
      res.status(401).json({ error: 'create order details error' })
    })
}
