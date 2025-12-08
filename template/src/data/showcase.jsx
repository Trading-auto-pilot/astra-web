import bg1 from 'assets/images/background/8.webp';
import bg2 from 'assets/images/background/9.webp';
import bg3 from 'assets/images/background/10.webp';
import bg4 from 'assets/images/background/11.webp';
import { initialConfig } from 'config';
import paths from 'routes/paths';

const screenshot = (index) => `${initialConfig.assetsDir}/images/showcase/${index}.webp`;
const video = (name) => `${initialConfig.assetsDir}/videos/showcase/${name}.webm`;

export const showcaseAssets = {
  hero: {
    video: video('beam'),
    planet: bg1,
  },
  customizeLayout: {
    dark: screenshot(1),
    light: screenshot(2),
  },
  prefixedLayout: {
    dark: screenshot(3),
    light: screenshot(4),
    illustrations: [bg2, bg3],
  },
  elegantCards: [screenshot(5), screenshot(6), screenshot(7), screenshot(8)],
  webApps: {
    apps: [screenshot(9), screenshot(10), screenshot(11), screenshot(12), screenshot(13)],
    illustrations: [bg4],
  },
  figmaCTA: [screenshot(14), screenshot(15)],
};

export const preloadAssets = [
  video('beam'),
  bg1,
  screenshot(1),
  screenshot(2),
  screenshot(3),
  screenshot(4),
];

export const figmaPreviewLink =
  'https://www.figma.com/design/F7bAaX5LvNCu8vipwhMmvx/Aurora_-Preview--v1.7.0-?node-id=201-89946&p=f&t=onuDvzKlSKplLD98-0';

export const navItems = [
  { label: 'Documentation', href: paths.gettingStared },
  { label: 'Support', href: 'mailto:support@themewagon.com' },
  { label: 'Hire us', href: 'https://themewagon.com/hire-us/' },
];

export const footerNavItems = [
  {
    label: 'Support',
    to: 'mailto:support@themewagon.com',
  },
  {
    label: 'Documentations',
    to: paths.gettingStared,
  },
  {
    label: 'Changelog',
    to: paths.changelog,
  },
];

export const layoutConfigs = [
  {
    fieldname: 'sidenavShape',
    title: 'Sidenav Shape',
    options: [
      { value: 'default', label: 'Default' },
      { value: 'slim', label: 'Slim' },
      { value: 'stacked', label: 'Stacked' },
    ],
  },
  {
    fieldname: 'layout',
    title: 'Layout',
    options: [
      { value: 'combo', label: 'Combo' },
      { value: 'sidenav', label: 'Sidenav' },
      { value: 'topnav', label: 'Topnav' },
    ],
  },
  {
    fieldname: 'topnavShape',
    title: 'Topnav Shape',
    options: [
      { value: 'default', label: 'Default' },
      { value: 'slim', label: 'Slim' },
      { value: 'stacked', label: 'Stacked' },
    ],
  },
];

export const prefixedLayouts = [
  {
    title: 'Combo Default',
    link: `${paths.ecommerce}?navigationMenuType=combo&sidenavType=default&topnavType=default`,
  },
  {
    title: 'RTL',
    link: `${paths.project}?textDirection=rtl`,
  },
  {
    title: 'TopNav Default',
    link: `${paths.crm}?navigationMenuType=topnav&topnavType=default`,
  },
  {
    title: 'SideNav Slim',
    link: `${paths.analytics}?navigationMenuType=sidenav&sidenavType=slim`,
  },
  {
    title: 'TopNav Stacked',
    link: `${paths.hrm}?navigationMenuType=topnav&topnavType=stacked`,
  },
  {
    title: 'Vibrant SideNav',
    link: `${paths.timeTracker}?navigationMenuType=sidenav&navColor=vibrant`,
  },
];

export const webApps = [
  {
    title: 'E commerce',
    link: `${paths.ecommerceHomepage}?defaultConfigs=true`,
  },
  {
    title: 'Kanban',
    link: `${paths.kanban}?defaultConfigs=true`,
  },
  {
    title: 'Calendar',
    link: `${paths.calendar}?defaultConfigs=true`,
  },
  {
    title: 'Chat',
    link: `${paths.chat}?defaultConfigs=true`,
  },
  {
    title: 'CRM',
    link: `${paths.deals}?defaultConfigs=true`,
  },
];
