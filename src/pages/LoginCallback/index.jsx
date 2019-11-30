import * as React from 'react';
import qs from 'query-string';
import axios from 'axios';
import { navigate } from '@reach/router';

const LoginCallback = () => {
  React.useEffect(() => {
    const { code, state, from } = qs.parse(window.location.search);
    const nextPage = from || '/';
    axios({
      method: 'get',
      url: `/.netlify/functions/auth?code=${code}&state=${state}`,
      headers: {
        Accept: 'application/json',
      },
    })
      .then(res => {
        const {
          data: { access_token },
        } = res;
        if (!access_token || typeof access_token !== 'string') {
          throw new Error();
        }
        localStorage.setItem('RK_auth_token', access_token);
        navigate(nextPage);
      })
      .catch(() => {
        navigate(nextPage);
      });
  }, []);
  return <div>logging in...</div>;
};

export default LoginCallback;
