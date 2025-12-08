import { initialConfig } from 'config';
import { users } from './users';

export const files = [
  {
    name: 'aurora_test17.zip',
    path: ':: files / New folder / aurora /',
    icon: 'material-symbols:folder-zip-outline-rounded',
  },
  {
    name: 'Product image(11).webp',
    path: ':: files / ... / assets /',
    image: `${initialConfig.assetsDir}/images/ecommerce/products/96x96/3.webp`,
  },
  {
    name: 'How_to_not_click_on_perfectly_innocent_looking_links_and_download_malware.pdf',
    path: ':: files / Download /',
    icon: 'material-symbols:picture-as-pdf-outline-rounded',
  },
];

export const contacts = [
  {
    name: 'Gojo Satoru',
    avatar: users[11].avatar,
  },
  {
    name: 'Nanami Kento',
    avatar: users[4].avatar,
    disabled: true,
  },
  {
    name: 'Kugisaki Nobara',
    avatar: users[3].avatar,
  },
  {
    name: 'Zenin Maki',
    avatar: users[14].avatar,
  },
  {
    name: 'Todo Aoi',
    avatar: users[8].avatar,
  },
];

export const tags = [
  'Calender',
  'Starter',
  'Back',
  'Procrastination',
  'Support',
  'Ideate',
  'Brainstorm',
  'How Might We',
];

export const breadcrumbs = [
  [
    {
      label: 'App',
      href: '#!',
    },
    {
      label: 'E-commerce',
      href: '#!',
    },
    {
      label: 'Customers',
      href: '#!',
    },
    {
      label: 'Create new',
      href: '#!',
      active: true,
    },
  ],
  [
    {
      label: 'Homepage',
      href: '#!',
    },
    {
      label: 'E-commerce',
      href: '#!',
      active: true,
    },
  ],
  [
    {
      label: 'Pages',
      href: '#!',
    },
    {
      label: 'Starter',
      href: '#!',
      active: true,
    },
  ],
];

export default {
  files,
  contacts,
  tags,
  breadcrumbs,
};
