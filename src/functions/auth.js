import axios from 'axios'

export const handler = async (event, _, callback) => {
  try {
    _retrieveToken(event, callback)
  } catch (e) {
    callback(Error(e), {
      status: 500,
      body: 'Server Error',
    })
  }
}

function _retrieveToken(event, callback) {
  const { code, state, redirect_uri } = event.queryStringParameters
  if (!code || !state || !redirect_uri) {
    throw new Error('Missing parameters')
  }
  axios({
    method: 'post',
    url: 'https://github.com/login/oauth/access_token',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    data: {
      code,
      client_id: __RK_RSVP_CLIENT_ID__,
      client_secret: __RK_RSVP_CLIENT_SECRET__,
      state,
      redirect_uri,
    },
  })
    .then(res => res.json())
    .then(res => {
      callback(null, {
        status: 200,
        body: res,
      })
    })
}
