import { FormProvider, useForm } from 'react-hook-form';
import { Button, Divider, Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import GeneralSettings from './GeneralSettings';

const ChatPreferencesTabPanel = () => {
  const methods = useForm({
    defaultValues: {
      showActivity: [
        {
          name: 'displayDot',
          checked: true,
          label: 'Display a dot (🔴) on the Home icon for unread activity.',
        },
      ],
      allwaysShowSidebar: [
        {
          name: 'unreadMessage',
          checked: true,
          label: 'Unread message',
        },
        {
          name: 'earphoneIcon',
          checked: true,
          label: 'Earphone icon in joining meeting',
        },
        {
          name: 'threadsMessage',
          checked: true,
          label: 'Threads message',
        },
        {
          name: 'draftsMessage',
          checked: false,
          label: 'Drafts & sent essage',
        },
      ],
      sortOption: 'all',
      additonalSettings: [
        {
          name: '',
          checked: true,
          label: 'Display profile picture next to direct messages.',
        },
        {
          name: 'organizeInboxes',
          checked: false,
          label: 'Organize private and public inboxes separately in the sidebar.',
        },
        {
          name: 'keepDirectMessages',
          checked: true,
          label: 'Keep direct messages and apps separate from the inbox in the sidebar.',
        },
        {
          name: 'prioritizeUnreadMentions',
          checked: false,
          label: 'Prioritize items with unread mentions (🔴) at the top of sections.',
        },
        {
          name: 'groupExternalChats',
          checked: false,
          label: 'Group external chats under the External Connection section.',
        },
        {
          name: 'showMutedItems',
          checked: true,
          label: 'Show muted items outside the sidebar menus.',
        },
      ],
    },
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
        spacing={5}
        onSubmit={handleSubmit(onSubmit)}
      >
        <AccountTabPanelSection
          title="General Settings"
          subtitle="Customize your chat experience with settings for notifications, privacy, appearance, and message handling."
          icon="material-symbols:settings-alert-outline-rounded"
        >
          <GeneralSettings />
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

export default ChatPreferencesTabPanel;
