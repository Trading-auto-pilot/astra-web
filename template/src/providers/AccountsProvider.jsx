import { createContext, use } from 'react';
import { personalInfoData } from 'data/account/personal-info';
import { billingAddressData, shippingAddressData } from 'data/account/shipping-billing-address';
import { backupSyncSettings, storageData } from 'data/account/storage';
import { globalPermissions, userPermissions } from 'data/account/user-permissions';
import { educationHistory, workHistory } from 'data/account/work-education-history';

export const AccountsContext = createContext({});

const AccountsProvider = ({ children }) => {
  const personalInfoValues = personalInfoData;
  const workHistoryValues = workHistory;
  const educationHistoryValues = educationHistory;

  return (
    <AccountsContext
      value={{
        personalInfo: personalInfoValues,
        workHistory: workHistoryValues,
        educationHistory: educationHistoryValues,
        usersPermissions: {
          globalPermissions: globalPermissions,
          collabPermission: 'anyone',
          userPermissions: userPermissions,
        },
        shippingBillingAddress: {
          shippingAddress: shippingAddressData,
          billingAddress: billingAddressData,
        },
        storage: {
          backupSyncSettings,
          storageData,
        },
      }}
    >
      {children}
    </AccountsContext>
  );
};

export const useAccounts = () => use(AccountsContext);

export default AccountsProvider;
