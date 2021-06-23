import prisma from 'libs/prisma'

export default async function handler(req, res) {
  try{
    const option = await prisma.productOption.create({
      data: req.body.option
    })
  
    res.status(200).json(option)
  }
  catch(err){
    console.log('create product option error:', err)
    res.status(401).json({ error: 'create product option error' })
  }
}
