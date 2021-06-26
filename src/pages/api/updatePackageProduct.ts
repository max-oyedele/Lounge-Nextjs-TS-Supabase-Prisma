import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try {
    const packageProduct = await prisma.packageProduct.update({
      where: {
        packageId_productId: {
          packageId: req.body.packageProduct.packageId,
          productId: req.body.packageProduct.productId,
        },
      },
      data: req.body.packageProduct,
    })

    res.status(200).json({ data: packageProduct })
  } catch (err) {
    res.status(401).json({ error: 'update packageproduct error' })
  }
}
