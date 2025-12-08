import { createContext, use, useCallback, useState } from 'react';
import { removeItemFromStore } from 'lib/utils';
import { firebaseAuth } from 'services/firebase/firebase';

export const AuthFirebaseContext = createContext({});

const AuthFirebaseProvider = ({ children }) => {
  const [sessionUser, setSessionUser] = useState(null);

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
    setSessionUser(null);
    removeItemFromStore('session_user');
    removeItemFromStore('auth_token');
    firebaseAuth.signOut();
  }, [setSessionUser]);

  return (
    <AuthFirebaseContext value={{ sessionUser, setSession, signout }}>
      {children}
    </AuthFirebaseContext>
  );
};

export const useAuth = () => use(AuthFirebaseContext);

export default AuthFirebaseProvider;
