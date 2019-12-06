const axios = require('../src/utils/axios');
const qs = require('query-string');

exports.handler = async event => {
  try {
    return await _retrieveToken(event);
  } catch (e) {
    let body = `Server Error`;
    if (e.message) {
      body = `${body} - ${e.message}`;
    }
    return {
      statusCode: 500,
      body,
    };
  }
};

async function _retrieveToken(event) {
  if (!process.env.RK_RSVP_CLIENT_ID)
    throw new Error('OAuth Client ID is not set');
  if (!process.env.RK_RSVP_CLIENT_SECRET)
    throw new Error('OAuth Client Secret is not set');
  const { code, state } = event.queryStringParameters;
  if (!code || !state) {
    throw new Error('Missing parameters');
  }
  const parameters = qs.stringify({
    code,
    client_id: process.env.RK_RSVP_CLIENT_ID,
    client_secret: process.env.RK_RSVP_CLIENT_SECRET,
    state,
  });
  const res = await axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?${parameters}`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });
  return {
    statusCode: 200,
    body: JSON.stringify(res.data),
  };
}
