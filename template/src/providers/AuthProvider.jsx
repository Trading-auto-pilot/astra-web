import { use } from 'react';
import AuthJwtProvider, { AuthJwtContext } from './auth-provider/AuthJwtProvider';
import SocialAuthProvider from './auth-provider/SocialAuthProvider';

// import Auth0Provider, { Auth0Context } from './auth-provider/Auth0Provider';
// import AuthFirebaseProvider, { AuthFirebaseContext } from './auth-provider/AuthFirebaseProvider';

const AuthMethodProvider = AuthJwtProvider;
const AuthMethodContext = AuthJwtContext;

// const AuthMethodProvider = Auth0Provider;
// const AuthMethodContext = Auth0Context;

// const AuthMethodProvider = AuthFirebaseProvider;
// const AuthMethodContext = AuthFirebaseContext;

const AuthProvider = ({ children }) => {
  return (
    <AuthMethodProvider>
      <SocialAuthProvider>{children}</SocialAuthProvider>
    </AuthMethodProvider>
  );
};

export const useAuth = () => use(AuthMethodContext);

export default AuthProvider;
