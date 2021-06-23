import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try {
    const option = await prisma.productOption.update({
      where: { id: req.body.option.id },
      data: req.body.option,
    })

    res.status(200).json({data: option})
  } catch (err) {
    res.status(401).json({ error: 'update product option error' })
  }
}
