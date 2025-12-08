import { users } from 'data/users';

export const jobOpenings = [
  {
    id: 1,
    title: 'Customer Support Manager',
    field: 'Support',
    branch: 'Chicago',
    vacancy: 1,
    candidates: 12,
    hiringLead: 'Mason Rivers',
    tags: [
      {
        label: 'Fulltime',
        color: 'primary',
      },
      {
        label: 'Remote',
        color: 'warning',
      },
      {
        label: 'Day Shift',
        color: 'info',
      },
    ],
    postedDate: '2024-10-23',
  },
  {
    id: 2,
    title: 'Sales Executive',
    field: 'Sales',
    branch: 'UK',
    vacancy: 4,
    candidates: 30,
    hiringLead: 'Oliver Stone',
    tags: [
      {
        label: 'Fulltime',
        color: 'primary',
      },
      {
        label: 'Onsite',
        color: 'warning',
      },
      {
        label: 'Night Shift',
        color: 'info',
      },
    ],
    postedDate: '2024-08-21',
  },
  {
    id: 3,
    title: 'Data Scientist',
    field: 'Data & Analytics',
    branch: 'Dhaka',
    vacancy: 10,
    candidates: 8,
    hiringLead: 'Lucas Grant',
    tags: [
      {
        label: 'Fulltime',
        color: 'primary',
      },
      {
        label: 'Hybrid',
        color: 'warning',
      },
      {
        label: 'Day Shift',
        color: 'info',
      },
    ],
    postedDate: '2024-06-22',
  },
  {
    id: 4,
    title: 'Frontend Developer',
    field: 'Engineering',
    branch: 'New York',
    vacancy: 1,
    candidates: 12,
    hiringLead: 'Mason Rivers',
    tags: [
      {
        label: 'Contract',
        color: 'primary',
      },
      {
        label: 'Onsite',
        color: 'warning',
      },
    ],
    postedDate: '2025-12-01',
  },
  {
    id: 5,
    title: 'UI/UX Designer',
    field: 'Design',
    branch: 'UK',
    vacancy: 4,
    candidates: 30,
    hiringLead: 'Oliver Stone',
    tags: [
      {
        label: 'Parttime',
        color: 'primary',
      },
      {
        label: 'Remote',
        color: 'warning',
      },
    ],
    postedDate: '2025-10-5',
  },
  {
    id: 6,
    title: 'Financial Analyst',
    field: 'Finance',
    branch: 'Manchester',
    vacancy: 10,
    candidates: 8,
    hiringLead: 'Lucas Grant',
    tags: [
      {
        label: 'Fulltime',
        color: 'primary',
      },
      {
        label: 'Onsite',
        color: 'warning',
      },
      {
        label: 'Day Shift',
        color: 'info',
      },
    ],
    postedDate: '2025-08-15',
  },
  {
    id: 7,
    title: 'Backend Developer',
    field: 'Engineering',
    branch: 'Los Angeles',
    vacancy: 1,
    candidates: 12,
    hiringLead: 'Mason Rivers',
    tags: [
      {
        label: 'Fulltime',
        color: 'primary',
      },
      {
        label: 'Onsite',
        color: 'warning',
      },
      {
        label: 'Night Shift',
        color: 'info',
      },
    ],
    postedDate: '2026-01-20',
  },
  {
    id: 8,
    title: 'Product Manager',
    field: 'Product',
    branch: 'Birmingham',
    vacancy: 4,
    candidates: 30,
    hiringLead: 'Oliver Stone',
    tags: [
      {
        label: 'Parttime',
        color: 'primary',
      },
      {
        label: 'Onsite',
        color: 'warning',
      },
      {
        label: 'Day Shift',
        color: 'info',
      },
    ],
    postedDate: '2026-05-12',
  },
  {
    id: 9,
    title: 'HR Manager',
    field: 'HR',
    branch: 'Liverpool',
    vacancy: 10,
    candidates: 8,
    hiringLead: 'Lucas Grant',
    tags: [
      {
        label: 'Parttime',
        color: 'primary',
      },
      {
        label: 'Remote',
        color: 'warning',
      },
      {
        label: 'Night Shift',
        color: 'info',
      },
    ],
    postedDate: '2026-04-25',
  },
  {
    id: 10,
    title: 'DevOps Engineer',
    field: 'IT',
    branch: 'San Fransisco',
    vacancy: 1,
    candidates: 12,
    hiringLead: 'Mason Rivers',
    tags: [
      {
        label: 'Parttime',
        color: 'primary',
      },
      {
        label: 'Hybrid',
        color: 'warning',
      },
    ],
    postedDate: '2026-02-14',
  },
  {
    id: 11,
    title: 'Sales Executive',
    field: 'Sales',
    branch: 'Edinburgh',
    vacancy: 4,
    candidates: 30,
    hiringLead: 'Oliver Stone',
    tags: [
      {
        label: 'Fulltime',
        color: 'primary',
      },
      {
        label: 'Remote',
        color: 'warning',
      },
      {
        label: 'Day Shift',
        color: 'info',
      },
    ],
    postedDate: '2026-05-30',
  },
  {
    id: 12,
    title: 'Data Scientist',
    field: 'Data & Analytics',
    branch: 'Glasgow',
    vacancy: 10,
    candidates: 8,
    hiringLead: 'Lucas Grant',
    tags: [
      {
        label: 'Contract',
        color: 'primary',
      },
      {
        label: 'Onsite',
        color: 'warning',
      },
    ],
    postedDate: '2026-06-18',
  },
];

export const pipelineData = [
  {
    id: 'list-1',
    title: 'Applied',
    items: [
      {
        id: 'item-1',
        user: users[2],
        rating: 0,
        appliedDate: '2025-03-23',
      },
      {
        id: 'item-2',
        user: users[15],
        rating: 0,
        appliedDate: '2025-03-12',
      },
      {
        id: 'item-3',
        user: users[13],
        rating: 0,
        appliedDate: '2025-03-14',
      },
      {
        id: 'item-4',
        user: users[4],
        rating: 0,
        appliedDate: '2025-02-16',
      },
      {
        id: 'item-5',
        user: users[14],
        rating: 0,
        appliedDate: '2025-02-14',
      },
      {
        id: 'item-6',
        user: users[12],
        rating: 0,
        appliedDate: '2025-02-14',
        comments: 1,
      },
    ],
  },
  {
    id: 'list-2',
    title: 'Reviewed',
    items: [
      {
        id: 'item-7',
        user: users[3],
        rating: 3,
        appliedDate: '2025-04-4',
      },
      {
        id: 'item-8',
        user: users[2],
        rating: 3,
        appliedDate: '2025-04-3',
      },
      {
        id: 'item-9',
        user: users[1],
        rating: 3,
        appliedDate: '2025-04-2',
      },
      {
        id: 'item-10',
        user: users[9],
        rating: 3,
        appliedDate: '2025-04-1',
      },
    ],
  },
  {
    id: 'list-3',
    title: 'Mobile Screening',
    items: [
      {
        id: 'item-11',
        user: users[12],
        rating: 3,
        appliedDate: '2025-04-15',
        comments: 1,
      },
      {
        id: 'item-12',
        user: users[10],
        rating: 3,
        appliedDate: '2025-04-5',
      },
      {
        id: 'item-13',
        user: users[11],
        rating: 3,
        appliedDate: '2025-04-12',
      },
      {
        id: 'item-14',
        user: users[7],
        rating: 3,
        appliedDate: '2025-04-10',
        comments: 1,
      },
    ],
  },
  {
    id: 'list-4',
    title: 'Interview',
    items: [
      {
        id: 'item-15',
        user: users[5],
        rating: 3,
        appliedDate: '2025-04-13',
      },
      {
        id: 'item-16',
        user: users[4],
        rating: 3,
        appliedDate: '2025-04-10',
        comments: 2,
      },
      {
        id: 'item-17',
        user: users[15],
        rating: 3,
        appliedDate: '2025-04-5',
      },
      {
        id: 'item-18',
        user: users[8],
        rating: 3,
        appliedDate: '2025-04-7',
        comments: 6,
      },
    ],
  },
  {
    id: 'list-5',
    title: 'Offer',
    items: [
      {
        id: 'item-19',
        user: users[2],
        rating: 3,
        appliedDate: '2025-04-9',
        comments: 4,
      },
      {
        id: 'item-20',
        user: users[10],
        rating: 3,
        appliedDate: '2025-04-12',
        comments: 5,
      },
      {
        id: 'item-21',
        user: users[3],
        rating: 3,
        appliedDate: '2025-04-8',
        comments: 6,
      },
      {
        id: 'item-22',
        user: users[5],
        rating: 3,
        appliedDate: '2025-04-6',
        comments: 3,
      },
    ],
  },
  {
    id: 'list-6',
    title: 'Hired',
    items: [
      {
        id: 'item-23',
        user: users[13],
        rating: 4,
        appliedDate: '2025-04-11',
        comments: 12,
      },
      {
        id: 'item-24',
        user: users[0],
        rating: 4,
        appliedDate: '2025-04-14',
        comments: 10,
      },
    ],
  },
];
