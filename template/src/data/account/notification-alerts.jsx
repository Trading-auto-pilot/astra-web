import { Typography } from '@mui/material';
import { initialConfig } from 'config';
import Image from 'components/base/Image';

export const desktopNotifications = [
  {
    name: 'googleChrome',
    checked: true,
    label: (
      <>
        <Image
          key="google-chrome-logo"
          width={24}
          src={`${initialConfig.assetsDir}/images/logo/21.svg`}
          alt="chrome logo"
        />
        <Typography key="google-chrome-title" component="span" variant="body2">
          Google Chrome
        </Typography>
      </>
    ),
  },
];
export const taggedNotifications = [
  { name: 'anyone', checked: false, label: 'Anyone' },
  { name: 'followers', checked: false, label: 'Followers' },
  { name: 'friends', checked: true, label: 'Friends' },
];
export const muteNotifications = [
  { name: 'youDontFollow', checked: false, label: 'You don’t follow' },
  { name: 'whoDontFollowYou', checked: false, label: 'Who don’t follow you' },
  { name: 'withNewAccount', checked: false, label: 'With a new account' },
  {
    name: 'whoHaventConfirmedEmail',
    checked: true,
    label: 'Who haven’t confirmed their email',
  },
  {
    name: 'whoHaventConfirmedPhoneNumber',
    checked: true,
    label: 'Who haven’t confirmed their phone number',
  },
];
