import { OAuth2Client } from 'google-auth-library';
const googleClientId = String(process.env.GOOGLE_CLIENT_ID);
const client = new OAuth2Client(googleClientId);
async function googleVerify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        requiredAudience: googleClientId
    });
    const { name, email, picture } = ticket.getPayload();
    return { name, email, img: picture };
}
export { googleVerify };
