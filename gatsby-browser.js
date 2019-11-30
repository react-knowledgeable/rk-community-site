import React from 'react';
import ReactDOM from 'react-dom';
import { AuthProvider } from './src/context/auth';

export const wrapRootElement = ({ element }) => (
  <AuthProvider>{element}</AuthProvider>
);

// https://twitter.com/EphemeralCircle/status/1190670453221842944?s=20
// our own @thchia actually also pointed this out as well
// https://github.com/react-knowledgeable/rk-community-site/issues/70#issuecomment-549008052
// took me much more hassle to figure this, apologize for my silliness
export const replaceHydrateFunction = () => {
  return (element, container, callback) => {
    ReactDOM.createRoot(container, {
      hydrate: true,
      hydrationOptions: { onHydrated: callback },
    }).render(element);
  };
};
