import { useSendPasswordResetLink } from 'services/swr/api-hooks/useAuthApi';
import ForgotPasswordForm from 'components/sections/authentications/default/ForgotPasswordForm';

const ForgotPassword = () => {
  const { trigger: sendResetLink } = useSendPasswordResetLink();

  const handleSendResetLink = async (data) => {
    return await sendResetLink(data).catch((error) => {
      throw new Error(error.data.message);
    });
  };

  return <ForgotPasswordForm handleSendResetLink={handleSendResetLink} />;
};

export default ForgotPassword;
