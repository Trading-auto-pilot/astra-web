import { createContext, use, useCallback, useEffect, useState } from 'react';
import { Auth0Provider as ReactAuth0Provider, useAuth0 } from '@auth0/auth0-react';
import { removeItemFromStore } from 'lib/utils';
import { firebaseAuth } from 'services/firebase/firebase';
import Splash from 'components/loading/Splash';

export const Auth0Context = createContext({});

const Auth0Provider = ({ children }) => {
  const [sessionUser, setSessionUser] = useState(null);
  const { user, isLoading, logout } = useAuth0();

  const setSession = useCallback(
    (user, token) => {
      setSessionUser(user);
      if (token) {
        localStorage.setItem('auth_token', token);
      }
    },
    [setSessionUser],
  );

  const signout = useCallback(() => {
    removeItemFromStore('session_user');
    removeItemFromStore('auth_token');
    if (sessionUser?.provider === 'firebase') {
      setSessionUser(null);
      firebaseAuth.signOut();
    } else {
      logout();
    }
  }, [setSessionUser, sessionUser]);

  useEffect(() => {
    if (user) {
      setSession({
        id: user?.sub || '',
        name: user?.name || 'User',
        email: user?.email || '',
        avatar: user?.picture || '',
      });
    } else {
      setSessionUser(null);
    }
  }, [user]);

  return (
    <Auth0Context
      value={{
        sessionUser,
        setSession,
        setSessionUser,
        signout,
      }}
    >
      {isLoading ? <Splash /> : children}
    </Auth0Context>
  );
};

export const useAuth = () => use(Auth0Context);

export const index = ({ children }) => {
  return (
    <ReactAuth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Auth0Provider>{children}</Auth0Provider>
    </ReactAuth0Provider>
  );
};

export default index;
