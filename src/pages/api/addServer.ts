import supabase from 'libs/supabase'

export default async function handler(req, res) {
  const { user, error } = await supabase.auth.signUp({
    email: req.body.email,
    password: 'NewServer',
  })

  if (user) {
    res.status(200).json({ data: user })
  }
  if (error) {
    console.log('create server error:', error)
    res.status(401).json({ error: error.message })
  }
}
