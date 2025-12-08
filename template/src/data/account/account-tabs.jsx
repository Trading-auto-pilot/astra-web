import AccessibilityTabPanel from 'components/sections/account/accessibility/AccessibilityTabPanel';
import AudioVideoTabPanel from 'components/sections/account/audio-video/AudioVideoTabPanel';
import ChatPreferencesTabPanel from 'components/sections/account/chat-preferences/ChatPreferencesTabPanel';
import CreditCardInfoTabPanel from 'components/sections/account/credit-card/CreditCardInfoTabPanel';
import DateTimeTabPanel from 'components/sections/account/date-time/DateTimeTabPanel';
import LanguageRegionTabPanel from 'components/sections/account/language-region/LanguageRegionTabPanel';
import NotificationAlertsTabPanel from 'components/sections/account/notification-alerts/NotificationAlertsTabPanel';
import PersonalInfoTabPanel from 'components/sections/account/personal-info/PersonalInfoTabPanel';
import PrivacyProtectionTabPanel from 'components/sections/account/privacy-protection/PrivacyProtectionTabPanel';
import ShippingBillingAddressTabPanel from 'components/sections/account/shipping-billing-address/ShippingBillingAddressTabPanel';
import StorageTabPanel from 'components/sections/account/storage/StorageTabPanel';
import TouchIDTabPanel from 'components/sections/account/touch-id/TouchIdTabPanel';
import UsersPermissionsTabPanel from 'components/sections/account/users-permissions/UsersPermissionsTabPanel';
import WorkEducationTabPanel from 'components/sections/account/work-education/WorkEducationTabPanel';

export const accountTabs = [
  {
    id: 1,
    label: 'Personal Information',
    title: 'Personal Info',
    value: 'personal_information',
    icon: 'material-symbols:person-outline',
    panelIcon: 'material-symbols:person-outline',
    tabPanel: <PersonalInfoTabPanel />,
  },
  {
    id: 2,
    label: 'Work & Education',
    title: 'Work & Education',
    value: 'work_education',
    icon: 'material-symbols:school-outline',
    panelIcon: 'material-symbols:school-outline',
    tabPanel: <WorkEducationTabPanel />,
  },
  {
    id: 3,
    label: 'Privacy & Protection',
    title: 'Privacy & Protection',
    value: 'privacy_protection',
    icon: 'material-symbols:shield-outline',
    panelIcon: 'material-symbols:shield-outline',
    tabPanel: <PrivacyProtectionTabPanel />,
  },
  {
    id: 4,
    label: 'Language & Region',
    title: 'Language & Region',
    value: 'language_region',
    icon: 'material-symbols:language',
    panelIcon: 'material-symbols:language',
    tabPanel: <LanguageRegionTabPanel />,
  },
  {
    id: 5,
    label: 'Notification & Alerts',
    title: 'Notification & Alerts',
    value: 'notification_alerts',
    icon: 'material-symbols:notifications-outline-rounded',
    panelIcon: 'material-symbols:notifications-outline-rounded',
    tabPanel: <NotificationAlertsTabPanel />,
  },
  {
    id: 6,
    label: 'Accessibility',
    title: 'Accessibility',
    value: 'accessibility',
    icon: 'material-symbols:front-hand-outline-rounded',
    panelIcon: 'material-symbols:front-hand-outline-rounded',
    tabPanel: <AccessibilityTabPanel />,
  },
  {
    id: 7,
    label: 'Credit Card Information',
    title: 'Credit Card Information',
    value: 'credit_card_information',
    icon: 'material-symbols:credit-card-outline',
    panelIcon: 'material-symbols:credit-card-outline',
    tabPanel: <CreditCardInfoTabPanel />,
  },
  {
    id: 8,
    label: 'Date & Time',
    title: 'Date and Time',
    value: 'date_time',
    icon: 'material-symbols:calendar-month-outline-rounded',
    panelIcon: 'material-symbols:calendar-month-outline-rounded',
    tabPanel: <DateTimeTabPanel />,
  },
  {
    id: 9,
    label: 'Users & Permissions',
    title: 'Users & Permissions',
    value: 'users_permissions',
    icon: 'material-symbols:manage-accounts-outline',
    panelIcon: 'material-symbols:manage-accounts-outline',
    tabPanel: <UsersPermissionsTabPanel />,
  },
  {
    id: 10,
    label: 'Shipping & Billing Address',
    title: 'Shipping & Billing Address',
    value: 'shipping_billing_address',
    icon: 'material-symbols:home-pin-outline',
    panelIcon: 'material-symbols:home-pin-outline',
    tabPanel: <ShippingBillingAddressTabPanel />,
  },
  {
    id: 11,
    label: 'Storage',
    title: 'Storage',
    value: 'storage',
    icon: 'material-symbols:data-usage',
    panelIcon: 'material-symbols:data-usage',
    tabPanel: <StorageTabPanel />,
  },
  {
    id: 12,
    label: 'Fingerprint Access Setup',
    title: 'Fingerprint Access Setup',
    value: 'touch_id',
    icon: 'material-symbols:touch-app-outline',
    panelIcon: 'material-symbols:touch-app-outline',
    tabPanel: <TouchIDTabPanel />,
  },
  {
    id: 13,
    label: 'Audio & Video',
    title: 'Audio & Video',
    value: 'audio_video',
    icon: 'material-symbols:video-settings-rounded',
    panelIcon: 'material-symbols:video-settings-rounded',
    tabPanel: <AudioVideoTabPanel />,
  },
  {
    id: 14,
    label: 'Chat Preferences',
    title: 'Chat Preferences',
    value: 'chat_preferences',
    icon: 'material-symbols:chat-outline-rounded',
    panelIcon: 'material-symbols:chat-outline-rounded',
    tabPanel: <ChatPreferencesTabPanel />,
  },
];
