import { useEffect } from 'react';
import { useAuth } from 'providers/AuthProvider';
import { firebaseAuth } from 'services/firebase/firebase';

const SocialAuthProvider = ({ children }) => {
  const { setSession } = useAuth();

  useEffect(() => {
    firebaseAuth?.onAuthStateChanged((user) => {
      if (user) {
        setSession({
          id: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
          provider: 'firebase',
        });
      }
    });
  }, []);

  return <>{children}</>;
};

export default SocialAuthProvider;
