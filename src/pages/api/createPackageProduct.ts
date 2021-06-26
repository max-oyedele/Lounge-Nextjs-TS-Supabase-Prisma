import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try {
    const count = await prisma.packageProduct.createMany({
      data: req.body.packagesProducts,
    })

    res.status(200).json({ data: count })
  } catch (err) {
    console.log('create package product error:', err)
    res.status(401).json({ error: 'create package product error' })
  }
}
