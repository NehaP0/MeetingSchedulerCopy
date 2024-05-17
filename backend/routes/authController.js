const axios = require('axios');

const tenantId = '0501ce3e-219a-49fb-8f13-ced243e93d8a';
const clientId = '039cc6c9-c3bb-4051-b439-a9180f7a94af';
const clientSecret = 'kn.8Q~Bozwgq~KJqrKvjCrZwunwGr0ucEXoDjaBt';
// const redirectUri = 'http://localhost:3000/token';
const redirectUri = 'http://localhost:4200/auth/callback';


async function exchangeCodeForToken(req, res) {
    console.log("function called", req.body);
    const code = req.body.code;

    try {
        const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

        const response = await axios.post(tokenEndpoint, {
            grant_type: 'authorization_code',
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
            scope: 'openid profile email Calendars.Read'
        });

        const accessToken = response.data.access_token;
        res.status(200).json({ access_token: accessToken });
    } catch (error) {
        console.error('Error obtaining access token:', error.response.data.error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = {
    exchangeCodeForToken
};
