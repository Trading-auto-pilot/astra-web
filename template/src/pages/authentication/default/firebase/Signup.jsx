import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useAuth } from 'providers/AuthProvider';
import paths from 'routes/paths';
import { firebaseAuth } from 'services/firebase/firebase';
import SignupForm from 'components/sections/authentications/default/SignupForm';

const Signup = () => {
  const { setSession } = useAuth();

  const handleSignup = async (data) => {
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      data.email,
      data.password,
    );

    if (userCredential) {
      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: data.name,
        });
      }
      setSession(
        {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          avatar: user.photoURL,
        },
        user.accessToken,
      );
    }
  };

  return (
    <SignupForm
      provider="firebase"
      handleSignup={handleSignup}
      loginLink={paths.defaultFirebaseLogin}
    />
  );
};

export default Signup;
