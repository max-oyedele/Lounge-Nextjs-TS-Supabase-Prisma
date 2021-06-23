import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try {
    const user = await prisma.user.update({
      where: { userId: req.body.user.userId },
      data: req.body.user,
    })

    res.status(200).json({ data: user })
  } catch (err) {
    res.status(401).json({ error: 'update user error' })
  }
}
