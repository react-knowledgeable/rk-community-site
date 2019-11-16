import { navigate } from '@reach/router';
import qs from 'query-string';

export const requestGitHubOAuth = () => {
  navigate(
    'https://github.com/login/oauth/authorize?' +
      qs.stringify({
        // TODO: move to fns
        client_id: 'e3a62ea68aca5801ec9b',
        state: 'home',
        login: 'react-knowledgeable',
      })
  );
};
