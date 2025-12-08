import { initialConfig } from 'config';

const logo = (index) => `${initialConfig.assetsDir}/images/logo/${index}.svg`;

export const workHistory = [
  {
    id: 1,
    companyName: 'ThemeWagon Inc.',
    companyLogo: logo(20),
    designation: 'UX/UI Designer',
    location: 'Dhaka, Bangladesh',
    startDate: '2023-12-01',
    currentlyWorking: true,
  },
  {
    id: 2,
    companyName: 'MailBluster Inc.',
    companyLogo: logo(23),
    designation: 'Jr. UX/UI Designer',
    location: 'Dhaka, Bangladesh',
    startDate: '2022-04-01',
    endDate: '2023-11-01',
    currentlyWorking: false,
  },
  {
    id: 3,
    companyName: 'TechNext Ltd.',
    companyLogo: logo(24),
    designation: 'Intern',
    location: 'Dhaka, Bangladesh',
    startDate: '2021-04-01',
    endDate: '2022-03-01',
    currentlyWorking: false,
  },
];

export const educationHistory = [
  {
    id: 1,
    institutionName: 'Harvard University',
    institutionLogo: logo(25),
    subject: 'Human Interaction Design',
    location: 'Sylhet, Bangladesh',
    startDate: '2014-01-01',
    endDate: '2019-12-01',
  },
  {
    id: 2,
    institutionName: 'Notre Dame College',
    institutionLogo: logo(26),
    subject: '',
    location: 'Dhaka, Bangladesh',
    startDate: '2012-01-01',
    endDate: '2013-12-01',
  },
];
