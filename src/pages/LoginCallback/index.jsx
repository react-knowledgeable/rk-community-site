import * as React from 'react';
import qs from 'query-string';

const LoginCallback = () => {
  React.useEffect(() => {
    const { code, state } = qs.parse(window.location.search);
    if (code) {
      // TODO: move this fn
      fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          // TODO: move to fns
          clientId: 'e3a62ea68aca5801ec9b',
          clientSecret: '8c4ab7debc3a642d95f68ef2895a5391491c3e95',
          code,
          redirect_uri: window.location.origin,
          state,
        }),
      })
        .then(res => res.json())
        .then(res => {
          console.log(res);
        });
    }
  }, []);
  return <div>logging in...</div>;
};

export default LoginCallback;
