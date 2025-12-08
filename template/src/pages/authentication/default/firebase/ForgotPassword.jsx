import { sendPasswordResetEmail } from 'firebase/auth';
import { firebaseAuth } from 'services/firebase/firebase';
import ForgotPasswordForm from 'components/sections/authentications/default/ForgotPasswordForm';

const ForgotPassword = () => {
  const handleSendResetLink = async ({ email }) => {
    return await sendPasswordResetEmail(firebaseAuth, email).catch((error) => {
      throw new Error(error.message);
    });
  };

  return <ForgotPasswordForm provider="firebase" handleSendResetLink={handleSendResetLink} />;
};

export default ForgotPassword;
