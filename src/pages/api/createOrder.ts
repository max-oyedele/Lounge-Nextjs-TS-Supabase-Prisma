import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try{
    const order = await prisma.order.create({
      data: req.body.order
    })
  
    res.status(200).json(order)
  }
  catch(err){
    console.log('create order error:', err)
    res.status(401).json({ error: 'create order error' })
  }
}
