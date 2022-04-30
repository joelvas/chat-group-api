const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const axios = require('axios')

async function googleVerify(token) {

  const ticket = await client.verifyIdToken({

    idToken: token,
    requiredAudience: process.env.GOOGLE_CLIENT_ID,
  });
  const { name, email, picture } = ticket.getPayload();
  return { name, email, img: picture }
}

module.exports = {
  googleVerify
}