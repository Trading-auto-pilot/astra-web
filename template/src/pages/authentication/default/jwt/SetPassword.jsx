import { useSetPassword } from 'services/swr/api-hooks/useAuthApi';
import SetPasswordForm from 'components/sections/authentications/default/SetPassworForm';

const SetPassword = () => {
  const { trigger: setPassword } = useSetPassword();

  const handleSetPassword = async (data) => {
    return await setPassword(data).catch((error) => {
      throw new Error(error.data.message);
    });
  };

  return <SetPasswordForm handleSetPassword={handleSetPassword} />;
};

export default SetPassword;
