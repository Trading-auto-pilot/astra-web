export const backupSyncSettings = [
  { name: 'Photos', enabled: true },
  { name: 'Email', enabled: false },
  { name: 'Contacts', enabled: true },
  { name: 'Videos', enabled: true },
  { name: 'Chats', enabled: true },
  { name: 'Calendar', enabled: false },
  { name: 'Notes', enabled: false },
  { name: 'Passwords', enabled: true },
  { name: 'Map', enabled: false },
];

export const storageData = {
  totalSpaceinKb: 20971520,
  totalSpaceUsedinKb: 19115540.48,
  categories: [
    {
      name: 'Photos',
      icon: 'material-symbols:imagesmode-outline',
      color: 'info.main',
      fileCount: 580,
      spaceUsedinKb: 6920601.6,
    },
    {
      name: 'Videos',
      icon: 'material-symbols:video-file-outline-rounded',
      color: 'primary.main',
      fileCount: 32,
      spaceUsedinKb: 3355443.2,
    },
    {
      name: 'Documents',
      icon: 'material-symbols:description-outline-rounded',
      color: 'warning.main',
      fileCount: 580,
      spaceUsedinKb: 3879731.2,
    },
    {
      name: 'Email',
      icon: 'material-symbols:mail-outline-rounded',
      color: 'success.main',
      fileCount: 356,
      spaceUsedinKb: 1887436.8,
    },
    {
      name: 'Chats',
      icon: 'material-symbols:chat-outline-rounded',
      color: 'error.main',
      fileCount: 39,
      spaceUsedinKb: 524288,
    },
    {
      name: 'Others',
      icon: 'material-symbols:article-outline-rounded',
      color: 'grey.500',
      fileCount: 948,
      spaceUsedinKb: 2202009.6,
    },
  ],
};
