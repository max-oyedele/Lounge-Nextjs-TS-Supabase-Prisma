
export default async function handler(req, res) {
  console.log(req.body)
  res.status(200).json({ status: 'OK' })
  
  // if (mail) {
  //   res.status(200).json({ status: 'OK' })
  // }
  // if (error) {
  //   console.log('send mail error:', error)
  //   res.status(401).json({ error: error.message })
  // }
}
