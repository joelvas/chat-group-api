import {
  OAuth2Client,
  VerifyIdTokenOptions,
  TokenPayload
} from 'google-auth-library'
const googleClientId = String(process.env.GOOGLE_CLIENT_ID)
const client = new OAuth2Client(googleClientId)

async function googleVerify(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    requiredAudience: googleClientId
  } as VerifyIdTokenOptions)
  const { name, email, picture } = ticket.getPayload() as TokenPayload
  return { name, email, img: picture }
}

export { googleVerify }
