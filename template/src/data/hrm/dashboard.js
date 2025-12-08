import { users } from 'data/users';

export const profile = {
  user: users[0],
  role: 'HR Manager (Sr)',
  details: {
    salary: 100000,
    recruiter: {
      name: 'Hugo Brook',
      link: '#!',
    },
    application: 25,
    department: 'Human resources',
    location: 'Remote',
    employment: 'Full',
  },
  kpis: [
    {
      value: 1053,
      subtitle: 'Total Headcount',
      change: {
        percentage: -0.73,
        since: 'last year',
      },
    },
    {
      value: 46,
      subtitle: 'Open Positions',
      change: {
        percentage: 0.0,
        since: 'last year',
      },
    },
    {
      value: '87%',
      subtitle: 'Successful Hiring',
      change: {
        percentage: 2.54,
        since: 'last year',
      },
    },
    {
      value: 15,
      subtitle: 'Due for Payraise',
      change: {
        percentage: 4.6,
        since: 'last year',
      },
    },
  ],
  leaves: [
    {
      title: 'Casual',
      days: 6,
      remainingDays: 5,
    },
    {
      title: 'Medical',
      days: 5,
      remainingDays: 2,
    },
    {
      title: 'In Lieu',
      days: 4,
      remainingDays: 1,
    },
    { title: 'Others', days: 7, remainingDays: 3 },
  ],
};

export const attendance = [
  {
    date: 'Jan, 2025',
    summary: [
      { status: 'ON TIME', count: 24 },
      { status: 'DELAYED', count: 12 },
      { status: 'ABSENT', count: 8 },
      { status: 'LEAVE', count: 17 },
    ],
    details: [
      {
        day: 1,
        status: 'ON TIME',
      },
      {
        day: 2,
        status: 'ON TIME',
      },
      {
        day: 3,
        status: 'ABSENT',
      },
      {
        day: 4,
        status: 'ON TIME',
      },
      {
        day: 5,
        status: 'LEAVE',
      },
      {
        day: 6,
        status: 'ON TIME',
      },
      {
        day: 7,
        status: 'ABSENT',
      },
      {
        day: 8,
        status: 'ON TIME',
      },
      {
        day: 9,
        status: 'DELAYED',
      },
      {
        day: 10,
        status: 'ON TIME',
      },
      {
        day: 11,
        status: 'LEAVE',
      },
      {
        day: 12,
        status: 'ABSENT',
      },
      {
        day: 13,
        status: 'ON TIME',
      },
      {
        day: 14,
        status: 'ON TIME',
      },
      {
        day: 15,
        status: 'DELAYED',
      },
      {
        day: 16,
        status: 'LEAVE',
      },
      {
        day: 17,
        status: 'ON TIME',
      },
      {
        day: 18,
        status: 'ON TIME',
      },
      {
        day: 19,
        status: 'ON TIME',
      },

      {
        day: 20,
        status: 'ON TIME',
      },
      {
        day: 21,
        status: 'ON TIME',
      },
      {
        day: 22,
        status: 'LEAVE',
      },
      {
        day: 23,
        status: 'ON TIME',
      },
      {
        day: 24,
        status: 'ON TIME',
      },
      {
        day: 25,
        status: 'ON TIME',
      },
      {
        day: 26,
        status: 'ON TIME',
      },
      {
        day: 27,
        status: 'ON TIME',
      },
      {
        day: 28,
        status: 'ON TIME',
      },
      {
        day: 29,
        status: 'LEAVE',
      },
      {
        day: 30,
        status: 'ON TIME',
      },
      {
        day: 31,
        status: 'DELAYED',
      },
    ],
  },
];

export const notifications = {
  date: 'Thu, 19/09/24',
  items: [
    {
      id: 1,
      title: 'Albus Dumbledore',
      subtitle: 'requested a meeting',
      type: 'request',
      timeframe: 'in 1 month',
    },
    {
      id: 2,
      title: 'w-8ben',
      subtitle: 'is waiting  for your signature',
      type: 'signature',
      status: 'Due',
    },
    {
      id: 3,
      title: 'Credence Barebone',
      subtitle: 'applied for 3 days leave (Oct 30-Nov 1)',
      type: 'application',
      applicationLink: '#!',
      timeframe: 'in 1 month',
    },
    {
      id: 4,
      title: 'Performance review',
      subtitle: 'of Queenie Goldstein is ready for you',
      type: 'review',
      status: 'Past Due',
    },
    {
      id: 5,
      title: 'Gellert Grindelwald',
      subtitle: 'applied for sabbatical',
      type: 'application',
      applicationLink: '#!',
      timeframe: 'in 1 month',
    },
    {
      id: 6,
      title: 'Albus Dumbledore',
      subtitle: 'requested a meeting',
      type: 'request',
      status: 'Cancelled',
    },
    {
      id: 7,
      title: 'Half Yearly Self Assessment',
      subtitle: 'is ready for you',
      type: 'task',
      status: 'Past Due',
    },
    {
      id: 8,
      title: 'Redrafted Benefit Form',
      subtitle: 'of Jacob Kowalski is waiting  for your signature',
      type: 'signature',
      status: 'Due',
    },
    {
      id: 9,
      title: 'Sirius Black',
      subtitle: 'applied for 1 day leave (Nov 1)',
      type: 'application',
      applicationLink: '#!',
      timeframe: 'in 1 month',
    },
    {
      id: 10,
      title: 'Performance review',
      subtitle: 'of Arthur Weasley in is ready for you',
      type: 'review',
      status: 'Due',
    },
  ],
};

export const allocation = {
  workforce: [
    {
      department: 'Design',
      headCount: 250,
    },
    {
      department: 'Marketing',
      headCount: 295,
    },
    {
      department: 'Accounts',
      headCount: 390,
    },
    {
      department: 'Logistics',
      headCount: 405,
    },
    {
      department: 'Management',
      headCount: 210,
    },
    {
      department: 'Development',
      headCount: 350,
    },
  ],
  expenses: [
    {
      category: 'Tangible Assets',
      budgets: [9200, 3000, 20000, 35000, 55000, 25000],
    },
    {
      category: 'Gross Salary',
      budgets: [4000, 10000, 18000, 22000, 22000, 18000],
    },
    {
      category: 'Direct Revenue',
      budgets: [16000, 15000, 28000, 12000, 40000, 11000],
    },
  ],
};

export const headcounts = [
  {
    name: 'Turnover',
    records: [
      { period: 'Jan', stats: { involuntary: 20, voluntary: 15, other: 10 } },
      { period: 'Feb', stats: { involuntary: 15, voluntary: 10, other: 8 } },
      { period: 'Mar', stats: { involuntary: 8, voluntary: 8, other: 5 } },
      { period: 'Apr', stats: { involuntary: 18, voluntary: 15, other: 0 } },
      { period: 'May', stats: { involuntary: 14, voluntary: 14, other: 9 } },
      { period: 'Jun', stats: { involuntary: 8, voluntary: 10, other: 6 } },
      { period: 'Jul', stats: { involuntary: 20, voluntary: 15, other: 10 } },
      { period: 'Aug', stats: { involuntary: 15, voluntary: 10, other: 8 } },
      { period: 'Sep', stats: { involuntary: 8, voluntary: 8, other: 5 } },
      { period: 'Oct', stats: { involuntary: 18, voluntary: 15, other: 0 } },
      { period: 'Nov', stats: { involuntary: 14, voluntary: 14, other: 9 } },
      { period: 'Dec', stats: { involuntary: 8, voluntary: 10, other: 6 } },
    ],
  },
  {
    name: 'Hired vs Left',
    records: [
      { period: 'Jan', stats: { involuntary: 18, voluntary: 15, other: 0 } },
      { period: 'Feb', stats: { involuntary: 8, voluntary: 8, other: 5 } },
      { period: 'Mar', stats: { involuntary: 14, voluntary: 14, other: 9 } },
      { period: 'Apr', stats: { involuntary: 25, voluntary: 10, other: 8 } },
      { period: 'May', stats: { involuntary: 8, voluntary: 10, other: 6 } },
      { period: 'Jun', stats: { involuntary: 15, voluntary: 10, other: 8 } },
      { period: 'Jul', stats: { involuntary: 18, voluntary: 15, other: 0 } },
      { period: 'Aug', stats: { involuntary: 14, voluntary: 14, other: 9 } },
      { period: 'Sep', stats: { involuntary: 25, voluntary: 10, other: 8 } },
      { period: 'Oct', stats: { involuntary: 8, voluntary: 8, other: 5 } },
      { period: 'Nov', stats: { involuntary: 8, voluntary: 10, other: 6 } },
      { period: 'Dec', stats: { involuntary: 15, voluntary: 10, other: 8 } },
    ],
  },
  {
    name: 'Contract',
    records: [
      { period: 'Jan', stats: { involuntary: 8, voluntary: 10, other: 6 } },
      { period: 'Feb', stats: { involuntary: 15, voluntary: 10, other: 8 } },
      { period: 'Mar', stats: { involuntary: 8, voluntary: 8, other: 5 } },
      { period: 'Apr', stats: { involuntary: 18, voluntary: 15, other: 0 } },
      { period: 'May', stats: { involuntary: 20, voluntary: 15, other: 10 } },
      { period: 'Jun', stats: { involuntary: 14, voluntary: 14, other: 9 } },
      { period: 'Jul', stats: { involuntary: 15, voluntary: 10, other: 8 } },
      { period: 'Aug', stats: { involuntary: 18, voluntary: 15, other: 0 } },
      { period: 'Sep', stats: { involuntary: 8, voluntary: 8, other: 5 } },
      { period: 'Oct', stats: { involuntary: 14, voluntary: 14, other: 9 } },
      { period: 'Nov', stats: { involuntary: 20, voluntary: 15, other: 10 } },
      { period: 'Dec', stats: { involuntary: 8, voluntary: 10, other: 6 } },
    ],
  },
];

export const resignations = [
  {
    id: 160102,
    profile: {
      name: 'Rubeus Hagrid',
      role: 'UX Designer',
      branch: 'Azkaban Branch',
      link: '#!',
    },
    reason: 'Salary',
    jssResponse: {
      status: 'unsatisfied',
      response: [
        { id: 1, label: 'neutral', value: 20 },
        { id: 2, label: 'satisfied', value: 30 },
        { id: 3, label: 'unsatisfied', value: 25 },
        { id: 4, label: 'upset', value: 10 },
        { id: 5, label: 'unsatisfied', value: 15 },
      ],
    },
    lastSalary: 16300,
    activity: {
      average: '67%',
      details: [
        12, 45, 78, 23, 89, 67, 34, 56, 90, 21, 37, 49, 83, 29, 94, 15, 66, 72, 88, 5, 41, 53, 97,
        31, 60, 19, 84, 7, 25, 92,
      ],
    },
  },
  {
    id: 140129,
    profile: {
      name: 'Sirius Black',
      role: 'Project Manager',
      branch: 'Quillmark Tower',
      link: '#!',
    },
    reason: 'Career Growth',
    jssResponse: {
      status: 'upset',
      response: [
        { id: 1, label: 'upset', value: 20 },
        { id: 2, label: 'unsatisfied', value: 10 },
        { id: 3, label: 'upset', value: 10 },
        { id: 4, label: 'unsatisfied', value: 10 },
        { id: 5, label: 'upset', value: 20 },
      ],
    },
    lastSalary: 42000,
    activity: {
      average: '75%',
      details: [
        38, 91, 47, 63, 74, 20, 14, 82, 58, 39, 99, 11, 27, 50, 66, 33, 80, 6, 43, 95, 23, 88, 12,
        77, 31, 65, 18, 53, 96, 42,
      ],
    },
  },
  {
    id: 720101,
    profile: {
      name: 'Neville Longbottom',
      role: 'IT Support',
      branch: 'Shrieking Shack',
      link: '#!',
    },
    reason: 'Career Growth',
    jssResponse: {
      status: 'satisfied',
      response: [
        { id: 1, label: 'satisfied', value: 30 },
        { id: 2, label: 'unsatisfied', value: 20 },
        { id: 3, label: 'satisfied', value: 25 },
        { id: 4, label: 'upset', value: 10 },
        { id: 5, label: 'unsatisfied', value: 15 },
      ],
    },
    lastSalary: 26000,
    activity: {
      average: '70%',
      details: [
        54, 76, 19, 88, 35, 71, 29, 99, 8, 42, 61, 90, 26, 45, 17, 79, 50, 97, 30, 12, 69, 85, 36,
        24, 58, 22, 95, 11, 67, 49,
      ],
    },
  },
  {
    id: 780101,
    profile: {
      name: 'Fred Weasley',
      role: 'System Architect',
      branch: 'Hogwarts Branch',
      link: '#!',
    },
    reason: 'Better Benefits',
    jssResponse: {
      status: 'unsatisfied',
      response: [
        { id: 1, label: 'upset', value: 20 },
        { id: 2, label: 'neutral', value: 10 },
        { id: 3, label: 'unsatisfied', value: 15 },
        { id: 4, label: 'upset', value: 10 },
        { id: 5, label: 'unsatisfied', value: 20 },
      ],
    },
    lastSalary: 82000,
    activity: {
      average: '62%',
      details: [
        89, 32, 14, 27, 63, 55, 48, 77, 92, 43, 86, 21, 30, 70, 10, 95, 31, 81, 99, 12, 25, 39, 50,
        62, 74, 47, 59, 20, 17, 88,
      ],
    },
  },
  {
    id: 791001,
    profile: {
      name: 'Arthur Weasley',
      role: 'Backend Dev.',
      branch: 'Shrieking Shack',
      link: '#!',
    },
    reason: 'Salary',
    jssResponse: {
      status: 'upset',
      response: [
        { id: 1, label: 'unsatisfied', value: 15 },
        { id: 2, label: 'satisfied', value: 10 },
        { id: 3, label: 'upset', value: 15 },
        { id: 4, label: 'unsatisfied', value: 10 },
        { id: 5, label: 'upset', value: 15 },
      ],
    },
    lastSalary: 42000,
    activity: {
      average: '85%',
      details: [
        60, 83, 12, 41, 95, 78, 34, 99, 17, 50, 61, 70, 88, 20, 47, 39, 84, 91, 26, 58, 11, 29, 35,
        90, 45, 76, 55, 25, 97, 53,
      ],
    },
  },
  {
    id: 250101,
    profile: {
      name: 'Draco Malfoy',
      role: 'Product Manager',
      branch: 'Malfoy Enterprises',
      link: '#!',
    },
    reason: 'Work-Life Balance',
    jssResponse: {
      status: 'unsatisfied',
      response: [
        { id: 1, label: 'satisfied', value: 20 },
        { id: 2, label: 'unsatisfied', value: 25 },
        { id: 3, label: 'upset', value: 20 },
        { id: 4, label: 'unsatisfied', value: 20 },
        { id: 5, label: 'upset', value: 20 },
      ],
    },
    lastSalary: 96000,
    activity: {
      average: '75%',
      details: [
        10, 73, 38, 52, 99, 29, 88, 76, 67, 23, 18, 31, 41, 86, 54, 80, 33, 45, 94, 66, 12, 70, 56,
        25, 43, 47, 61, 90, 19, 77,
      ],
    },
  },
  {
    id: 200105,
    profile: {
      name: 'Luna Lovegood',
      role: 'Graphic Designer',
      branch: 'The Quibbler',
      link: '#!',
    },
    reason: 'Career Growth',
    jssResponse: {
      status: 'satisfied',
      response: [
        { id: 1, label: 'neutral', value: 20 },
        { id: 2, label: 'satisfied', value: 30 },
        { id: 3, label: 'upset', value: 10 },
        { id: 4, label: 'satisfied', value: 20 },
        { id: 5, label: 'unsatisfied', value: 20 },
      ],
    },
    lastSalary: 38500,
    activity: {
      average: '60%',
      details: [
        28, 49, 67, 88, 75, 92, 39, 81, 19, 55, 12, 32, 70, 47, 60, 44, 96, 23, 89, 50, 34, 99, 27,
        83, 58, 11, 91, 42, 77, 17,
      ],
    },
  },
  {
    id: 450107,
    profile: {
      name: 'Severus Snape',
      role: 'Chemist',
      branch: 'Potion Labs Inc.',
      link: '#!',
    },
    reason: 'Better Benefits',
    jssResponse: {
      status: 'upset',
      response: [
        { id: 1, label: 'upset', value: 20 },
        { id: 2, label: 'unsatisfied', value: 10 },
        { id: 3, label: 'upset', value: 15 },
        { id: 4, label: 'upset', value: 20 },
        { id: 5, label: 'unsatisfied', value: 15 },
      ],
    },
    lastSalary: 78000,
    activity: {
      average: '55%',
      details: [
        55, 72, 39, 93, 50, 12, 28, 84, 46, 67, 33, 95, 87, 41, 20, 75, 64, 88, 23, 61, 31, 79, 14,
        91, 70, 58, 29, 45, 99, 26,
      ],
    },
  },
  {
    id: 380104,
    profile: {
      name: 'Ginny Weasley',
      role: 'Sports Journalist',
      branch: 'Daily Prophet',
      link: '#!',
    },
    reason: 'Salary',
    jssResponse: {
      status: 'satisfied',
      response: [
        { id: 1, label: 'satisfied', value: 25 },
        { id: 2, label: 'neutral', value: 10 },
        { id: 3, label: 'satisfied', value: 20 },
        { id: 4, label: 'unsatisfied', value: 10 },
        { id: 5, label: 'satisfied', value: 15 },
      ],
    },
    lastSalary: 45200,
    activity: {
      average: '68%',
      details: [
        31, 48, 76, 29, 89, 62, 35, 44, 12, 99, 19, 57, 70, 85, 28, 23, 61, 92, 46, 33, 81, 97, 54,
        74, 11, 58, 41, 90, 17, 50,
      ],
    },
  },
  {
    id: 590102,
    profile: {
      name: 'Bellatrix Lestrange',
      role: 'Legal Consultant',
      branch: 'Dark Arts Firm',
      link: '#!',
    },
    reason: 'Toxic Work Environment',
    jssResponse: {
      status: 'upset',
      response: [
        { id: 1, label: 'upset', value: 20 },
        { id: 2, label: 'unsatisfied', value: 10 },
        { id: 3, label: 'upset', value: 15 },
        { id: 4, label: 'unsatisfied', value: 15 },
        { id: 5, label: 'upset', value: 15 },
      ],
    },
    lastSalary: 120000,
    activity: {
      average: '40%',
      details: [
        19, 73, 45, 86, 34, 62, 81, 55, 99, 47, 90, 58, 23, 33, 79, 12, 49, 88, 26, 92, 17, 50, 70,
        31, 29, 61, 28, 11, 48, 77,
      ],
    },
  },
];
