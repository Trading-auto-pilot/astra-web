import { users } from 'data/users';

export const taskMetrics = [
  {
    title: 'Running',
    count: 7,
    change: {
      amount: 2,
      direction: 'less',
      timeFrame: 'last month',
    },
    icon: {
      name: 'material-symbols:note-outline',
      color: 'primary',
    },
  },
  {
    title: 'Completed',
    count: 24,
    change: {
      amount: 5,
      direction: 'more',
      timeFrame: 'last week',
    },
    icon: {
      name: 'material-symbols:check-box-outline',
      color: 'success',
    },
  },
  {
    title: 'Due Soon',
    count: 23,
    deadlineRange: '03 Mar',
    icon: {
      name: 'material-symbols:hourglass-empty',
      color: 'warning',
    },
  },
];

export const deadlineMetrics = [
  { id: 1, completed: 'before', count: 3, prevCompleteCount: 3 },
  { id: 2, completed: 'on', count: 14, prevCompleteCount: 17 },
  { id: 3, completed: 'after', count: 6, prevCompleteCount: 5 },
];

export const upcomingMeetings = [
  {
    id: 1,
    title: 'Catching up on regular updates',
    date: '11 March, 2023',
    time: '3:30 PM',
    status: {
      label: 'Now',
      active: true,
    },
    joinMeetLink: '#!',
    attendants: [users[3], users[4], users[6], users[10], users[11], users[13]],
  },
  {
    id: 2,
    title: 'Meeting with project lead',
    date: '13 March, 2023',
    time: '9:30 PM',
    status: {
      label: '2 days',
    },
    attendants: [users[2], users[3]],
  },
  {
    id: 3,
    title: 'Discussion with the developers on planning',
    date: '16 March, 2023',
    time: '7:30 PM',
    status: {
      label: '3 days',
    },
    attendants: [users[5], users[7], users[8], users[9]],
  },
  {
    id: 4,
    title: 'Quick idea sharing session.',
    date: '17 March, 2023',
    time: '12:00 PM',
    status: {
      label: '4 days',
    },
    attendants: [users[3], users[1], users[10]],
  },
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth();

export const projectTimelineData = [
  {
    id: 1,
    label: 'Design new app',
    status: 'ongoing',
    tasks: [
      {
        id: 1,
        label: 'Research User Needs',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 1).getTime(),
        endDate: new Date(currentYear, currentMonth, 10).getTime(),
      },
      {
        id: 2,
        label: 'Create Wireframe Layouts',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 11).getTime(),
        endDate: new Date(currentYear, currentMonth, 20).getTime(),
      },
      {
        id: 15,
        label: 'Post-Deployment Monitoring',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth, 22).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 10).getTime(),
      },
      {
        id: 16,
        label: 'Final System Optimizations',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth + 1, 11).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 26).getTime(),
      },
    ],
  },
  {
    id: 2,
    label: 'New dashboard',
    status: 'ongoing',
    tasks: [
      {
        id: 3,
        label: 'Finish designing',
        amountDone: 90,
        startDate: new Date(currentYear, currentMonth, 1).getTime(),
        endDate: new Date(currentYear, currentMonth, 5).getTime(),
      },
      {
        id: 4,
        label: 'System Deployment',
        amountDone: 90,
        startDate: new Date(currentYear, currentMonth, 6).getTime(),
        endDate: new Date(currentYear, currentMonth, 24).getTime(),
      },
      {
        id: 13,
        label: 'User Testing and Feedback',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth, 25).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 15).getTime(),
      },
      {
        id: 14,
        label: 'Design Finalization',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth + 1, 16).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 27).getTime(),
      },
    ],
  },
  {
    id: 3,
    label: 'Falcon Development',
    status: 'due',
    tasks: [
      {
        id: 5,
        label: 'Analyze Competitor Apps',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth, 1).getTime(),
        endDate: new Date(currentYear, currentMonth, 9).getTime(),
      },
      {
        id: 6,
        label: 'Design Database Schema',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth, 10).getTime(),
        endDate: new Date(currentYear, currentMonth, 27).getTime(),
      },
      {
        id: 17,
        label: 'Setup Development Environment',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth, 28).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 10).getTime(),
      },
      {
        id: 18,
        label: 'Begin Core Development',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth + 1, 11).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 28).getTime(),
      },
    ],
  },
  {
    id: 4,
    label: 'Phoenix Travel App ',
    status: 'complete',
    tasks: [
      {
        id: 7,
        label: 'Develop Backend Services',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 1).getTime(),
        endDate: new Date(currentYear, currentMonth, 3).getTime(),
      },
      {
        id: 8,
        label: 'Gather User Requirements',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 4).getTime(),
        endDate: new Date(currentYear, currentMonth, 31).getTime(),
      },
      {
        id: 19,
        label: 'App Integration Testing',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth + 1, 3).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 12).getTime(),
      },
      {
        id: 20,
        label: 'Final Debugging and Deployment',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth + 1, 14).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 28).getTime(),
      },
    ],
  },
  {
    id: 5,
    label: 'Design Finance App',
    status: 'complete',
    tasks: [
      {
        id: 9,
        label: 'Implement Authentication and Authorization',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 1).getTime(),
        endDate: new Date(currentYear, currentMonth, 24).getTime(),
      },
      {
        id: 22,
        label: 'Security Audits and Final Review',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth, 26).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 24).getTime(),
      },
    ],
  },
  {
    id: 6,
    label: 'Update Figma File ',
    status: 'complete',
    tasks: [
      {
        id: 10,
        label: 'Develop Initial Prototype',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 1).getTime(),
        endDate: new Date(currentYear, currentMonth, 5).getTime(),
      },
      {
        id: 11,
        label: 'Identify Elements to be Updated',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 6).getTime(),
        endDate: new Date(currentYear, currentMonth, 12).getTime(),
      },
      {
        id: 12,
        label: 'Create Detailed Project Plan',
        amountDone: 100,
        startDate: new Date(currentYear, currentMonth, 13).getTime(),
        endDate: new Date(currentYear, currentMonth, 27).getTime(),
      },
      {
        id: 23,
        label: 'UI/UX Refinements and Updates',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth, 28).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 15).getTime(),
      },
      {
        id: 24,
        label: 'Final Prototype Approval',
        amountDone: 0,
        startDate: new Date(currentYear, currentMonth + 1, 16).getTime(),
        endDate: new Date(currentYear, currentMonth + 1, 28).getTime(),
      },
    ],
  },
];

export const projectHours = {
  aurora: [65, 65, 90, 90, 275, 275, 375, 150, 120],
  falcon: [50, 26, 75, 50, 175, 175, 105, 260, 350],
  phoenix: [25, 85, 45, 140, 140, 340, 155, 205, 190],
};

export const projectsInfos = [
  {
    id: 1,
    name: 'Aurora',
    color: 'primary',
    tasks: [
      {
        id: 1,
        name: 'Design new app',
        eta: '2023-11-16',
        lead: users[5],
        members: [users[15], users[5], users[13]],
        progress: 100,
        state: 'Done',
      },
    ],
  },
  {
    id: 2,
    name: 'Falcon',
    color: 'warning',
    tasks: [
      {
        id: 1,
        name: 'Create Detailed Project Plan',
        eta: '2023-11-25',
        lead: users[15],
        members: [users[2], users[1], users[3], users[12], users[14], users[5]],
        progress: 46.8,
        state: 'Overdue',
      },
      {
        id: 2,
        name: 'Develop Initial Prototype',
        eta: '2023-11-29',
        lead: users[14],
        members: [users[3], users[13], users[2]],
        progress: 20.2,
        state: 'Delayed',
      },
      {
        id: 3,
        name: 'Perform Quality Assurance Testing',
        eta: '2023-12-02',
        lead: users[13],
        members: [users[4], users[8], users[5], users[7]],
        progress: 80,
        state: 'On Track',
      },
    ],
  },
];

export const events = [
  {
    id: 1,
    title: 'Redesign module',
    allDayEvent: true,
    category: 'important',
    startDate: '2024-11-19',
    startTime: '9:00 am',
    endDate: '2024-11-21',
    endTime: '5:00 pm',
    members: [users[15], users[5], users[13]],
    eventType: 'physical',
    virtualLink: '#!',
    physical: 'Abc street',
    notificationMinutesBefore: 15,
    color: 'warning',
  },
  {
    id: 2,
    title: 'Monthly team meeting for Falcon React Project',
    allDayEvent: false,
    category: 'upcoming',
    startDate: '2024-11-30',
    startTime: '7:00 am',
    members: [users[2], users[1], users[3], users[12], users[14], users[5]],
    eventType: 'online',
    virtualLink: 'https://meet.google.com/abc-123',
    notificationMinutesBefore: 45,
    color: 'success',
  },
  {
    id: 3,
    title: 'GTA VI trailer release watch party',
    allDayEvent: false,
    category: 'my_events',
    startDate: '2024-12-05',
    startTime: '12:00 pm',
    eventType: 'physical',
    virtualLink: '#!',
    physical: 'Abc street',
    notificationMinutesBefore: 30,
    members: [users[4], users[8], users[5], users[7]],
    color: 'primary',
  },
  {
    id: 4,
    title: 'Celebration for GTA VI trailer release',
    allDayEvent: false,
    category: 'upcoming',
    startDate: '2024-12-08',
    startTime: '4:00 pm',
    members: [users[15], users[5], users[13]],
    eventType: 'hybrid',
    virtualLink: 'https://meet.google.com/abc-123',
    physical: 'Abc street',
    notificationMinutesBefore: 15,
    color: 'success',
  },
];

export const eventCategories = [
  { value: 'my_events', label: 'My Events', color: 'primary' },
  { value: 'upcoming', label: 'Upcoming', color: 'success' },
  { value: 'important', label: 'Important', color: 'warning' },
];
