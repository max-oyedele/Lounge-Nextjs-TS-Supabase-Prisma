import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try {
    const product = await prisma.product.update({
      where: { id: req.body.product.id },
      data: req.body.product,
    })

    res.status(200).json({data: product})
  } catch (err) {
    res.status(401).json({ error: 'update product error' })
  }
}
