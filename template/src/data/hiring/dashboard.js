import { users } from 'data/users';

// Stats
export const statData = [
  {
    title: 'Active Job',
    subTitle: 'previous month',
    value: '2080',
    icon: 'material-symbols:work-outline',
  },
  {
    title: 'Applied',
    subTitle: 'previous month',
    value: 1000100,
    icon: 'material-symbols:person-outline-rounded',
  },
  {
    title: 'Reviewed',
    subTitle: 'previous month',
    value: 900200,
    icon: 'material-symbols:preview-outline',
  },
  {
    title: 'Interviewed',
    subTitle: 'previous month',
    value: 800400,
    icon: 'material-symbols:group-outline',
  },
  {
    title: 'Offered',
    subTitle: 'previous month',
    value: 3500,
    icon: 'material-symbols:docs-outline-rounded',
  },
  {
    title: 'Hired',
    subTitle: 'previous month',
    value: 1400,
    icon: 'material-symbols:thumb-up-outline',
  },
];

// Candidate Sources
export const candidateSourcesData = [
  { name: 'Boards', value: 19444 },
  { name: 'Referrals', value: 13889 },
  { name: 'Agency', value: 11111 },
  { name: 'Socials', value: 25000 },
  { name: 'Website', value: 16667 },
  { name: 'Others', value: 13889 },
];

// My Positions
export const positionsData = [
  {
    title: 'Customer Support Manager',
    field: 'Support',
    location: 'New York',
    users: [users[4], users[1], users[15], users[12], users[0], users[13]],
    status: { text: 'Active', color: 'success' },
  },
  {
    title: 'Software Engineer',
    field: 'Engineering',
    location: 'San Francisco',
    users: [users[4], users[8], users[5], users[7]],
    status: { text: 'Active', color: 'success' },
  },
  {
    title: 'UI/UX Designer',
    field: 'Design',
    location: 'London',
    users: [users[2], users[1], users[3], users[12], users[0], users[13]],
    status: { text: 'Active', color: 'success' },
  },
  {
    title: 'Product Manager',
    field: 'Product',
    location: 'Chicago',
    users: [users[15], users[5], users[13]],
    status: { text: 'Closed', color: 'neutral' },
  },
  {
    title: 'Digital Marketing Executive',
    field: 'Support',
    location: 'New York',
    users: [users[2], users[1], users[3], users[12], users[0], users[13]],
    status: { text: 'Active', color: 'success' },
  },
];

// New Hires
export const newHiresData = [
  { ...users[7], designation: 'HR Manager', location: 'Dhaka', joiningDate: '2025-06-01' },
  { ...users[2], designation: 'Software Engineer', location: 'Seoul', joiningDate: '2025-06-02' },
  { ...users[13], designation: 'Sales Executive', location: 'Dubai', joiningDate: '2025-06-03' },
  { ...users[5], designation: 'UI/UX Designer', location: 'Toronto', joiningDate: '2025-06-04' },
  { ...users[8], designation: 'QA Analyst', location: 'London', joiningDate: '2025-06-05' },
];

// Meetings
export const meetingsData = [
  {
    type: 'Panel Interview',
    title: 'Technical Interview with Martin Parr',
    time: '02:00 pm',
    duration: '45 min',
    chip: {
      icon: 'material-symbols:autorenew-rounded',
      color: 'primary',
    },
  },
  {
    type: 'One-on-One',
    title: 'HR Screening with Emily Tran',
    time: '12:00 pm',
    duration: '45 min',
    chip: {
      icon: 'material-symbols:check-rounded',
      color: 'success',
    },
  },
  {
    type: 'Panel Interview',
    title: 'Final Round Interview with Jake Oliver',
    time: '10:00 pm',
    duration: '1 hr',
    chip: {
      icon: 'material-symbols:close-rounded',
      color: 'error',
    },
  },
  {
    type: 'Panel Interview',
    title: 'Technical Interview with Sarah Williams',
    time: '09:00 am',
    duration: '45 min',
    chip: {
      icon: 'material-symbols:check-rounded',
      color: 'success',
    },
  },
];

// Candidates
export const candidatesData = [
  7000, 9000, 8500, 9000, 6000, 8500, 5000, 7500, 10500, 5000, 5500, 8500, 10500, 6500, 4000, 6000,
  9000, 8000,
];

// Pipeline
export const pipelineData = [
  {
    id: 1,
    jobPosition: {
      title: 'Software Engineer',
      field: 'Engineering',
    },
    vacancy: 1,
    hiringManager: users[0],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: 50,
    offer: 20,
    hired: 2,
    rejected: 16,
  },
  {
    id: 2,
    jobPosition: {
      title: 'Digital Marketing Executive',
      field: 'Marketing',
    },
    vacancy: 2,
    hiringManager: users[7],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: 50,
    offer: 20,
    hired: null,
    rejected: null,
  },
  {
    id: 3,
    jobPosition: {
      title: 'QA Engineering',
      field: 'Engineering',
    },
    vacancy: 3,
    hiringManager: users[15],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: null,
    offer: null,
    hired: null,
    rejected: null,
  },
  {
    id: 4,
    jobPosition: {
      title: 'Finance Associate',
      field: 'Finance',
    },
    vacancy: 5,
    hiringManager: users[5],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: null,
    offer: 20,
    hired: null,
    rejected: null,
  },
  {
    id: 5,
    jobPosition: {
      title: 'UI/UX Designer',
      field: 'Designer',
    },
    vacancy: 1,
    hiringManager: users[8],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: 50,
    offer: 20,
    hired: null,
    rejected: null,
  },
  {
    id: 6,
    jobPosition: {
      title: 'Customer Support Specialist',
      field: 'Customer Support',
    },
    vacancy: 2,
    hiringManager: users[1],
    applied: 300,
    reviewed: 150,
    mobileScreen: null,
    interview: null,
    offer: null,
    hired: null,
    rejected: null,
  },
  {
    id: 7,
    jobPosition: {
      title: 'Sales Executive',
      field: 'Sales',
    },
    vacancy: 1,
    hiringManager: users[11],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: null,
    offer: 20,
    hired: 2,
    rejected: 16,
  },
  {
    id: 8,
    jobPosition: {
      title: 'HR Coordinator',
      field: 'Human Resources',
    },
    vacancy: 2,
    hiringManager: users[3],
    applied: 300,
    reviewed: 150,
    mobileScreen: null,
    interview: 40,
    offer: 10,
    hired: 1,
    rejected: 8,
  },
  {
    id: 9,
    jobPosition: {
      title: 'Product Manager',
      field: 'Product',
    },
    vacancy: 1,
    hiringManager: users[9],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: 60,
    offer: 15,
    hired: null,
    rejected: null,
  },
  {
    id: 10,
    jobPosition: {
      title: 'Data Analyst',
      field: 'Data Science',
    },
    vacancy: 2,
    hiringManager: users[12],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: 45,
    offer: 12,
    hired: 1,
    rejected: 6,
  },
  {
    id: 11,
    jobPosition: {
      title: 'Content Writer',
      field: 'Marketing',
    },
    vacancy: 3,
    hiringManager: users[4],
    applied: 300,
    reviewed: 150,
    mobileScreen: null,
    interview: null,
    offer: null,
    hired: null,
    rejected: null,
  },
  {
    id: 12,
    jobPosition: {
      title: 'DevOps Engineer',
      field: 'Engineering',
    },
    vacancy: 2,
    hiringManager: users[6],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: 55,
    offer: 18,
    hired: 2,
    rejected: 10,
  },
  {
    id: 13,
    jobPosition: {
      title: 'Legal Advisor',
      field: 'Legal',
    },
    vacancy: 1,
    hiringManager: users[14],
    applied: 300,
    reviewed: 150,
    mobileScreen: null,
    interview: 20,
    offer: 5,
    hired: null,
    rejected: 4,
  },
  {
    id: 14,
    jobPosition: {
      title: 'Operations Manager',
      field: 'Operations',
    },
    vacancy: 2,
    hiringManager: users[10],
    applied: 300,
    reviewed: 150,
    mobileScreen: 80,
    interview: 50,
    offer: 22,
    hired: 2,
    rejected: 15,
  },
];
