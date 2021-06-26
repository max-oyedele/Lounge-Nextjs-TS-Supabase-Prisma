import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try {
    const product = await prisma.product.create({
      data: req.body.product,
    })

    res.status(200).json({ data: product })
  } catch (err) {
    console.log('create product error:', err)
    res.status(401).json({ error: 'create product error' })
  }
}
