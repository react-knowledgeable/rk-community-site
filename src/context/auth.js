import React from 'react';

const defaultContext = {
  token: '',
  setToken: () => {},
};

const AuthContext = React.createContext(defaultContext);

function AuthProvider({ children }) {
  const [token, setToken] = React.useState('');
  const contextValue = React.useMemo(
    () => ({
      token,
      setToken,
    }),
    [token, setToken]
  );
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;
