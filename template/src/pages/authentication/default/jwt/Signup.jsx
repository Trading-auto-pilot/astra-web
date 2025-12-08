import { useNavigate } from 'react-router';
import { useAuth } from 'providers/AuthProvider';
import paths, { rootPaths } from 'routes/paths';
import { useRegisterUser } from 'services/swr/api-hooks/useAuthApi';
import SignupForm from 'components/sections/authentications/default/SignupForm';

const Signup = () => {
  const { setSession } = useAuth();
  const { trigger: signup } = useRegisterUser();
  const navigate = useNavigate();

  const handleSignup = async (data) => {
    const res = await signup(data).catch((error) => {
      throw new Error(error.data.message);
    });
    if (res) {
      setSession(res.user, res.authToken);
      navigate(rootPaths.root);
    }
  };

  return <SignupForm handleSignup={handleSignup} loginLink={paths.defaultJwtLogin} />;
};

export default Signup;
