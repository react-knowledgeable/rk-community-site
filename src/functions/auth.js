import axios from 'axios';
import qs from 'query-string';

export const handler = async (event, _, callback) => {
  try {
    await _retrieveToken(event, callback);
  } catch (e) {
    callback(e, {
      statusCode: 500,
      body: 'Server Error',
    });
  }
};

async function _retrieveToken(event, callback) {
  const { code, state } = event.queryStringParameters;
  if (!code || !state) {
    throw new Error('Missing parameters');
  }
  const parameters = qs.stringify({
    code,
    client_id: '__RK_RSVP_CLIENT_ID__',
    client_secret: '__RK_RSVP_CLIENT_SECRET__',
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
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      access_token: res.access_token,
    }),
  });
}
