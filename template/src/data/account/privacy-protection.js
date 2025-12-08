import { initialConfig } from 'config';

const logo = (index) => `${initialConfig.assetsDir}/images/logo/${index}.svg`;

export const loggedInDevices = [
  {
    id: 1,
    name: 'MacBook Air M1',
    icon: logo(22),
    location: 'Dhaka, Bangladesh',
    currentlyLoggedIn: false,
    firstLoggedTime: new Date(2024, 0, 11, 12, 0),
    lastLoggedTime: new Date(2024, 2, 15, 14, 40),
    browsersAppsServices: [
      {
        icon: logo(21),
        name: 'Google chrome',
      },
      {
        icon: logo(22),
        name: 'Mac OS X',
      },
    ],
  },
  {
    id: 2,
    name: 'Windows Laptop',
    icon: logo(2),
    location: 'Dhaka, Bangladesh',
    currentlyLoggedIn: true,
    firstLoggedTime: new Date(2024, 2, 15, 14, 40),
    lastLoggedTime: new Date(),
    browsersAppsServices: [
      {
        icon: logo(21),
        name: 'Google chrome',
      },
    ],
  },
];

export const connectedDevices = [
  {
    id: 1,
    securityKey: '1234',
    deviceName: 'Security Key 2(FIDO U2F)',
    connected: true,
    used: true,
    currentlyUsed: true,
    lastUsedDate: new Date(),
    deviceIcon: 'material-symbols-light:chromecast-device-outline',
  },
  {
    id: 2,
    securityKey: '5678',
    deviceName: 'Security Key (FIDO 2)',
    connected: true,
    used: false,
    currentlyUsed: false,
    lastUsedDate: new Date(),
    deviceIcon: 'material-symbols-light:chromecast-device-outline',
  },
  {
    id: 3,
    securityKey: '1234',
    deviceName: 'Galaxy Z Fold 3',
    connected: true,
    used: true,
    currentlyUsed: false,
    lastUsedDate: new Date(2024, 2, 15, 14, 40),
    deviceIcon: 'material-symbols-light:phone-android-outline',
  },
];
