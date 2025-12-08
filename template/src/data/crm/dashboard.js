export const dealsData = [
  {
    icon: 'material-symbols:handshake-outline-rounded',
    count: 310,
    label: 'Deals created',
    percentage: 4.3,
    trend: 'up',
  },
  {
    icon: 'material-symbols:payments-outline-rounded',
    count: 26,
    label: 'Deals closed',
    percentage: 1.9,
    trend: 'down',
  },
];

export const kpisData = [
  {
    title: 'Active Users',
    value: 3050,
    subtitle: 'Avg. daily logins',
    icon: {
      name: 'material-symbols-light:location-away-outline-rounded',
      color: 'primary.main',
    },
  },
  {
    title: 'New Contacts',
    value: 105,
    subtitle: 'Accounts opened',
    icon: {
      name: 'material-symbols-light:verified-outline-rounded',
      color: 'warning.main',
    },
  },
  {
    title: 'Renewal Rate',
    value: '37%',
    subtitle: 'Premium accounts',
    icon: {
      name: 'material-symbols-light:published-with-changes-rounded',
      color: 'success.main',
    },
  },
  {
    title: 'Inventory',
    value: 13200,
    subtitle: 'Units in stock',
    icon: {
      name: 'material-symbols-light:warehouse-outline-rounded',
      color: 'secondary.main',
    },
  },
  {
    title: 'Delivered',
    value: 1920,
    subtitle: 'Unit products',
    icon: {
      name: 'material-symbols-light:local-shipping-outline-rounded',
      color: 'info.main',
    },
  },
];

export const crmGeneratedRevenueData = {
  '25th': [250000, 180000, 270000, 220000, 120000, 150000, 200000],
  '50th': [350000, 280000, 370000, 320000, 200000, 250000, 300000],
  '75th': [450000, 380000, 470000, 420000, 300000, 350000, 400000],
};

export const leadSoursesData = [
  { value: 1048, name: 'Organic' },
  { value: 735, name: 'Marketing' },
  { value: 580, name: 'Social media' },
  { value: 484, name: 'Blog posts' },
];

export const acquisitionCostData = {
  allotted: [350000, 280000, 370000, 320000, 400000, 250000, 300000],
  used: [250000, 180000, 100000, 220000, 120000, 150000, 200000],
};

export const saleFunnelData = {
  awareness: 100,
  research: 80,
  intent: 65,
  evaluation: 48,
  negotiation: 37,
  aquisition: 30,
};

export const saleFunnelTableData = [
  { stageIndicator: 'chBlue.100', stage: 'Awareness', lostLead: 32.2, thisMonth: 6.01 },
  { stageIndicator: 'chBlue.200', stage: 'Research', lostLead: 30.1, thisMonth: 4.12 },
  { stageIndicator: 'chBlue.300', stage: 'Intent', lostLead: 22.1, thisMonth: 3.91 },
  { stageIndicator: 'chBlue.400', stage: 'Evaluation', lostLead: 15.6, thisMonth: 0.01 },
  { stageIndicator: 'chBlue.500', stage: 'Negotiation', lostLead: 30.1, thisMonth: 4.12 },
  { stageIndicator: 'chGreen.500', stage: 'Acquisition', lostLead: 30.1, thisMonth: 4.12 },
];

export const customerFeedbackData = {
  positive: [13000, 15000, 8000, 8000, 8000, 16500, 18000, 16500, 4000, 12000, 4000, 8000, 13000],
  negative: [
    -5000, -5000, -4000, -7000, -4500, -6500, -9500, -6500, -5000, -1500, -1500, -6000, -6200,
  ],
  '75thPercentile': [6000, 8000, 5000, 2000, 5000, 8000, 7000, 8000, -1500, 10000, 3000, 200, 7000],
};

export const avgLifetimeValueData = {
  cac: [
    2000, 2500, 2600, 2800, 3200, 3700, 4200, 4800, 4400, 5100, 5400, 5800, 6200, 7000, 6500, 6900,
    6600, 7400, 7700, 7300, 7800, 7900, 7700, 8000, 7500, 8100, 8300, 8250, 8400, 7800,
  ],
  ltv: [
    1000, 1100, 1300, 1500, 1700, 1800, 1900, 1700, 2000, 1900, 2100, 2000, 2300, 2200, 2400, 2000,
    1950, 2050, 2200, 2300, 2100, 2150, 2000, 2200, 2600, 2350, 2300, 2600, 2550, 2350,
  ],
};

export const activeUsersData = {
  placeholder: [
    1000, 3800, 5000, 5400, 4200, 1700, 1700, 2600, 3600, 4600, 4900, 6600, 3700, 3700, 4900,
  ],
  users: [3800, 5000, 5400, 6900, 5400, 4100, 2600, 3600, 4500, 4900, 7400, 7400, 6500, 4800, 6900],
};
