import * as React from 'react';
import qs from 'query-string';
import axios from 'axios';
import { navigate } from '@reach/router';

const LoginCallback = () => {
  React.useEffect(() => {
    const { code, state } = qs.parse(window.location.search);
    axios(`/.netlify/functions/auth?code=${code}&state=${state}`).then(res => {
      console.log(res);
      localStorage.setItem('RK_auth_token', res.access_token);
      navigate('/');
    });
  }, []);
  return <div>logging in...</div>;
};

export default LoginCallback;
