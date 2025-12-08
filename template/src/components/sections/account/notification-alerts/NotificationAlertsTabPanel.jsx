import { FormProvider, useForm } from 'react-hook-form';
import { Button, Divider, Stack } from '@mui/material';
import {
  desktopNotifications,
  muteNotifications,
  taggedNotifications,
} from 'data/account/notification-alerts';
import { useSnackbar } from 'notistack';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import GeneralNotification from './GeneralNotification';
import NotificationReceivingMethod from './NotificationReceivingMethod';

const NotificationAlertsTabPanel = () => {
  const methods = useForm({
    defaultValues: {
      desktopNotifications,
      taggedNotifications,
      muteNotifications,
      push: {
        checked: true,
        options: {
          newNotifications: false,
          directNotifications: true,
          postsEmailed: false,
          notificationFrequency: 'Off',
          feedback: false,
          deals: true,
          personalizedDeals: false,
          updates: false,
          accountSecurity: true,
          packageUpdates: false,
        },
      },
      email: {
        checked: false,
        options: {
          newNotifications: false,
          directNotifications: false,
          postsEmailed: false,
          notificationFrequency: 'Off',
          feedback: false,
          deals: false,
          personalizedDeals: false,
          updates: false,
          accountSecurity: false,
          packageUpdates: false,
        },
      },
      sms: {
        checked: false,
        options: {
          newNotifications: false,
          directNotifications: false,
          postsEmailed: false,
          notificationFrequency: 'Off',
          feedback: false,
          deals: false,
          personalizedDeals: false,
          updates: false,
          accountSecurity: false,
          packageUpdates: false,
        },
      },
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, reset } = methods;
  const onSubmit = (data) => {
    console.log(data);
    enqueueSnackbar('Updated successfully!', { variant: 'success', autoHideDuration: 3000 });
  };

  return (
    <FormProvider {...methods}>
      <Stack
        component="form"
        direction="column"
        divider={<Divider />}
        spacing={5}
        onSubmit={handleSubmit(onSubmit)}
      >
        <AccountTabPanelSection
          title="General Settings"
          subtitle="Set your notification preferences. Select who can tag you and mute notifications from specific user groups to maintain a streamlined experience."
          icon="material-symbols:settings-alert-outline"
        >
          <GeneralNotification />
        </AccountTabPanelSection>

        <AccountTabPanelSection
          title="Notification Receiving Method"
          icon="material-symbols:settings-alert-outline"
        >
          <NotificationReceivingMethod />
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

export default NotificationAlertsTabPanel;
