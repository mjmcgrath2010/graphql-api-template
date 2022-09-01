require('dotenv').config()
import jwt from 'jsonwebtoken'
const SECRET = process.env.SECRET

export const makeJwtToken = (user) => {
  const { _id: userId, email } = user
  const token = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: { userId, email },
    },
    SECRET
  )

  return token
}

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET)
    return decoded.data
  } catch (err) {
    return { userId: null }
  }
}
