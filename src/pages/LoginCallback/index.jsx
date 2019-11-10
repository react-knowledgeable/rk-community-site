import * as React from 'react';
import qs from 'query-string';

const LoginCallback = () => {
  React.useEffect(() => {
    const { code, state } = qs.parse(window.location.search);
    if (code) {
      fetch(
        'https://github.com/login/oauth/access_token?' +
          qs.stringify({
            // TODO: move to fns
            code,
            redirect_uri: window.location.origin,
            state,
          }),
        {
          method: 'POST',
        }
      )
        .then(res => res.json())
        .then(res => {
          console.log(res);
        });
    }
  }, []);
  return <div>logging in...</div>;
};

export default LoginCallback;
