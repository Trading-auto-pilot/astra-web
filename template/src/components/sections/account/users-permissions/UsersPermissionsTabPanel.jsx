import { FormProvider, useForm } from 'react-hook-form';
import { Button, Divider, Stack } from '@mui/material';
import { users } from 'data/users';
import { useSnackbar } from 'notistack';
import { useAccounts } from 'providers/AccountsProvider';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import CollabPermissions from './CollabPermissions';
import Global from './Global';
import Ownership from './Ownership';
import UserPermissions from './UserPermissions';

const UsersPermissionsTabPanel = () => {
  const { usersPermissions } = useAccounts();
  const methods = useForm({
    defaultValues: usersPermissions,
  });
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, reset } = methods;
  const onSubmit = (data) => {
    console.log({ data });
    enqueueSnackbar('Updated successfully!', { variant: 'success' });
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        direction="column"
        divider={<Divider />}
        spacing={4}
        onSubmit={handleSubmit(onSubmit)}
      >
        <AccountTabPanelSection title="Store owner" icon="material-symbols:storefront-outline">
          <Ownership
            name="Tsamina Mina"
            email="tsaminamina@email.com"
            avatar={users[6].avatar}
            lastLoginAt="2024-11-15 15:54"
          />
        </AccountTabPanelSection>
        <AccountTabPanelSection title="Global" icon="material-symbols:public">
          <Global />
        </AccountTabPanelSection>
        <AccountTabPanelSection
          title="Collaborator Request Permissions"
          icon="material-symbols:lock-person-outline"
        >
          <CollabPermissions />
        </AccountTabPanelSection>
        <AccountTabPanelSection title="User Permissions" icon="material-symbols:person-outline">
          <UserPermissions />
          <Stack justifyContent="flex-end" spacing={1}>
            <Button variant="soft" color="neutral" onClick={() => reset()}>
              Discard
            </Button>
            <Button type="submit" variant="contained">
              Confirm
            </Button>
          </Stack>
        </AccountTabPanelSection>
      </Stack>
    </FormProvider>
  );
};

export default UsersPermissionsTabPanel;
