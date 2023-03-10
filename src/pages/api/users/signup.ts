import { NextApiRequest, NextApiResponse } from 'next'
import { connectDB } from '@/utils'
import { User } from '@/lib/models'
import bcrypt from 'bcryptjs'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req
  if (method !== 'POST') return res.status(405).send('req_method_not_supported')
  const { name, surname, email, phone, password } = body
  await connectDB()

  User.findOne({ email }, 'email')
    .then((user) => {
      if (!!user) return res.status(403).json({ emailIsRegistered: true })
      bcrypt
        .hash(password, 12)
        .then((hash) => {
          const newUser = new User({
            name,
            surname,
            email,
            phone,
            password: hash,
          })
          newUser
            .save()
            .then((user) => res.status(200).json(user))
            .catch(() => Error)
        })
        .catch(() => Error)
    })
    .catch(() => res.status(500).send('Something went wrong.'))
}

export default handler
