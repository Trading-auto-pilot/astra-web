import { initialConfig } from 'config';
import { users } from 'data/users';
import dayjs from 'dayjs';

const image = (index) => `${initialConfig.assetsDir}/images/time-tracker/${index}.webp`;

export const kpis = [
  {
    title: 'Total Hours',
    value: '123:23:01',
    changePercent: 0.73,
    trend: 'decrease',
    since: 'last week',
    hours: [6, 8, 5, 7, 6, 4, 5],
  },
  {
    title: 'Weekly Activity',
    value: '66.05%',
    changePercent: 2.54,
    trend: 'increase',
    since: 'last week',
    activities: [60, 75, 45, 85, 35, 75, 65],
  },
  {
    title: 'Earned this Week',
    value: '$350',
    changePercent: 1.53,
    trend: 'increase',
    since: 'last week',
    earnings: [140, 80, 180, 120, 150, 50, 120],
  },
  {
    title: 'Projects Worked',
    value: '15',
    changePercent: 0.33,
    trend: 'decrease',
    since: 'last week',
    projectsWorked: {
      lastWeek: [8, 10, 6, 10, 8, 12, 7],
      prevWeek: [5, 10, 12, 4, 5, 3, 5],
    },
  },
];

export const screencasts = [
  {
    id: 1010,
    name: users[1].name,
    avatar: users[1].avatar,
    screenshots: [
      {
        id: 1,
        activity: 12,
        screenshot: image(1),
      },
      {
        id: 2,
        activity: 48,
        screenshot: image(2),
      },
      {
        id: 3,
        activity: 68,
        screenshot: image(3),
      },
      {
        id: 4,
        activity: 37,
        screenshot: image(4),
      },
    ],
  },
  {
    id: 1012,
    name: users[2].name,
    avatar: users[2].avatar,
    screenshots: [
      {
        id: 5,
        activity: 64,
        screenshot: image(4),
      },
      {
        id: 6,
        activity: 45,
        screenshot: image(5),
      },
      {
        id: 7,
        activity: 10,
        screenshot: image(6),
      },
      {
        id: 8,
        activity: 33,
        screenshot: image(2),
      },
    ],
  },
];

export const timesheet = [
  {
    id: 1,
    project: 'Smart Workflow System',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          6060, 8902, 5674, 7453, 5613, 7145, 8831, 6501, 6961, 4073, 8775, 6053, 7155, 4871, 4881,
          6753, 7196, 4660, 6557, 7687, 8731, 4723, 7138, 7756, 6029, 5577, 8923, 7386, 5005, 8007,
        ],
      },
      {
        user: users[2],
        team: 'Team B',
        durations: [
          6907, 5688, 4117, 7460, 7800, 7962, 7231, 8834, 5670, 4475, 6524, 8119, 8347, 7470, 8919,
          4478, 6016, 8235, 8900, 8322, 4222, 7438, 6043, 4245, 7540, 8247, 8483, 4671, 5312, 6784,
        ],
      },
      {
        user: users[3],
        team: 'Team B',
        durations: [
          6947, 4284, 5508, 6211, 8754, 8482, 5528, 6653, 6827, 5690, 8900, 4132, 4609, 6931, 8810,
          7340, 5475, 5142, 4623, 7918, 7407, 8305, 7374, 5420, 8177, 6116, 5941, 5747, 7421, 4818,
        ],
      },
      {
        user: users[4],
        team: 'Team C',
        durations: [
          4578, 4783, 5326, 6691, 7934, 4896, 4844, 4191, 5258, 5281, 7866, 6016, 7723, 6279, 5330,
          4395, 7735, 5572, 5294, 7648, 4552, 7668, 6182, 6810, 7434, 5718, 8961, 6795, 8101, 6932,
        ],
      },
    ],
  },
  {
    id: 2,
    project: 'ByteVista – Data Analytics Suite',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          6972, 7991, 4372, 6244, 7455, 7621, 4851, 8784, 8541, 5767, 5838, 6891, 7775, 7248, 7518,
          7109, 8682, 7822, 8598, 7603, 4729, 5013, 5144, 4831, 4051, 6736, 5459, 4813, 8690, 6757,
        ],
      },
      {
        user: users[2],
        team: 'Team A',
        durations: [
          7694, 5641, 5522, 8508, 7331, 5011, 6068, 8927, 6256, 7185, 6825, 6573, 7438, 7937, 5613,
          8354, 8615, 6339, 7587, 7401, 5515, 4953, 6004, 4711, 4522, 7999, 4273, 4990, 4465, 6843,
        ],
      },
      {
        user: users[3],
        team: 'Team B',
        durations: [
          4626, 7647, 8123, 7621, 6620, 4306, 7128, 5126, 7142, 5614, 7605, 5414, 4660, 5556, 6437,
          4356, 4010, 7885, 8813, 7202, 6629, 5636, 5908, 7773, 4250, 6479, 7458, 7689, 6979, 7052,
        ],
      },
      {
        user: users[4],
        team: 'Team C',
        durations: [
          8490, 8656, 7222, 8827, 4171, 5891, 6398, 5140, 8796, 4451, 5060, 5845, 7167, 8596, 4386,
          5035, 8840, 4815, 4303, 5127, 6466, 7922, 5500, 4862, 4372, 8094, 6238, 4608, 7605, 4938,
        ],
      },
    ],
  },
  {
    id: 3,
    project: 'Cloud Integration Hub',
    workLogs: [
      {
        user: users[1],
        team: 'Team C',
        durations: [
          4500, 4800, 5100, 5300, 5600, 5800, 6000, 6200, 6400, 6600, 6800, 7000, 7200, 7400, 7600,
          7800, 8000, 8200, 8400, 8600, 8800, 9000, 4200, 4400, 4600, 4800, 5000, 5200, 5400, 5600,
        ],
      },
      {
        user: users[2],
        team: 'Team A',
        durations: [
          4900, 5200, 5500, 5700, 6000, 6200, 6500, 6800, 7000, 7300, 7500, 7800, 8100, 8300, 8600,
          8800, 9000, 4100, 4300, 4600, 4800, 5100, 5300, 5600, 5800, 6100, 6300, 6600, 6900, 7200,
        ],
      },
      {
        user: users[3],
        team: 'Team B',
        durations: [
          4200, 4500, 4800, 5000, 5300, 5500, 5800, 6100, 6400, 6600, 6900, 7100, 7400, 7700, 8000,
          8300, 8600, 8800, 9000, 4100, 4300, 4600, 4800, 5100, 5300, 5600, 5900, 6200, 6500, 6800,
        ],
      },
      {
        user: users[4],
        team: 'Team C',
        durations: [
          4700, 5000, 5300, 5500, 5800, 6100, 6300, 6600, 6900, 7100, 7400, 7600, 7900, 8200, 8500,
          8700, 9000, 4100, 4300, 4600, 4800, 5000, 5300, 5600, 5800, 6100, 6400, 6700, 7000, 7300,
        ],
      },
    ],
  },
  {
    id: 4,
    project: 'Cloud Networking UI',
    workLogs: [
      {
        user: users[1],
        team: 'Team B',
        durations: [
          4300, 4600, 4900, 5100, 5400, 5600, 5900, 6200, 6500, 6800, 7000, 7300, 7500, 7800, 8100,
          8300, 8600, 8800, 9000, 4100, 4300, 4600, 4900, 5200, 5500, 5800, 6000, 6300, 6600, 6900,
        ],
      },
      {
        user: users[2],
        team: 'Team C',
        durations: [
          4500, 4800, 5100, 5300, 5600, 5800, 6100, 6400, 6700, 6900, 7200, 7400, 7700, 8000, 8200,
          8500, 8800, 9000, 4100, 4300, 4600, 4900, 5200, 5500, 5700, 6000, 6300, 6600, 6900, 7200,
        ],
      },
      {
        user: users[3],
        team: 'Team A',
        durations: [
          4900, 5200, 5500, 5700, 6000, 6200, 6500, 6800, 7100, 7300, 7600, 7900, 8200, 8400, 8700,
          9000, 4100, 4300, 4600, 4900, 5100, 5400, 5700, 6000, 6200, 6500, 6800, 7000, 7300, 7600,
        ],
      },
      {
        user: users[4],
        team: 'Team A',
        durations: [
          4200, 4500, 4800, 5000, 5300, 5500, 5800, 6100, 6400, 6600, 6900, 7100, 7400, 7700, 8000,
          8300, 8600, 8800, 9000, 4100, 4300, 4600, 4900, 5200, 5500, 5800, 6000, 6300, 6600, 6900,
        ],
      },
    ],
  },
  {
    id: 5,
    project: 'DevOps Management',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          4600, 4900, 5200, 5400, 5700, 5900, 6200, 6500, 6800, 7000, 7300, 7600, 7900, 8100, 8400,
          8700, 9000, 4100, 4300, 4600, 4900, 5200, 5500, 5800, 6000, 6300, 6600, 6900, 7200, 7500,
        ],
      },
      {
        user: users[2],
        team: 'Team B',
        durations: [
          4700, 5000, 5300, 5500, 5800, 6100, 6400, 6700, 6900, 7200, 7500, 7700, 8000, 8300, 8600,
          8800, 9000, 4100, 4300, 4600, 4900, 5200, 5500, 5800, 6000, 6300, 6600, 6900, 7200, 7500,
        ],
      },
      {
        user: users[3],
        team: 'Team C',
        durations: [
          4900, 5200, 5500, 5700, 6000, 6200, 6500, 6800, 7000, 7300, 7600, 7800, 8100, 8300, 8600,
          8800, 9000, 4100, 4300, 4600, 4900, 5200, 5500, 5800, 6000, 6300, 6600, 6900, 7200, 7500,
        ],
      },
      {
        user: users[4],
        team: 'Team C',
        durations: [
          4200, 4500, 4800, 5000, 5300, 5500, 5800, 6100, 6400, 6600, 6900, 7100, 7400, 7700, 8000,
          8300, 8600, 8800, 9000, 4100, 4300, 4600, 4900, 5200, 5500, 5800, 6000, 6300, 6600, 6900,
        ],
      },
    ],
  },
  {
    id: 6,
    project: 'NexaFlow – Smart Workflow System',
    workLogs: [
      {
        user: users[1],
        team: 'Team B',
        durations: [
          3111, 2630, 2468, 2385, 2533, 4558, 1077, 3713, 4016, 1372, 2025, 1582, 2826, 2021, 3935,
          2425, 4208, 4380, 2255, 2655, 4409, 1344, 2189, 3790, 3065, 1221, 4889, 1036, 3067, 4444,
        ],
      },
      {
        user: users[2],
        team: 'Team B',
        durations: [
          2754, 2137, 4997, 1520, 3395, 3220, 1970, 1523, 1932, 3098, 4874, 1185, 1664, 3527, 3192,
          2410, 2065, 3700, 4865, 4424, 3484, 3241, 2376, 4612, 3714, 2038, 3144, 2906, 4393, 2794,
        ],
      },
      {
        user: users[3],
        team: 'Team C',
        durations: [
          1855, 4854, 4880, 4354, 2375, 1678, 3078, 4854, 4881, 3241, 4358, 4686, 1724, 1163, 4390,
          2101, 4744, 3953, 4987, 3412, 3128, 2914, 2693, 2328, 2656, 4967, 1737, 3088, 4514, 4058,
        ],
      },
      {
        user: users[4],
        team: 'Team A',
        durations: [
          4738, 2546, 3841, 2325, 2170, 3832, 3541, 1797, 4067, 1338, 2561, 1275, 1725, 2693, 4281,
          3467, 3325, 3908, 2144, 2644, 4311, 1476, 4776, 3958, 1811, 3164, 3323, 1820, 2691, 4904,
        ],
      },
    ],
  },
  {
    id: 7,
    project: 'AI-Powered Chatbot',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          1226, 4267, 4742, 1832, 1348, 2738, 1597, 3908, 1822, 4594, 1791, 3562, 4805, 2277, 2427,
          4855, 1761, 1760, 3176, 3542, 1636, 1525, 1266, 4741, 1975, 2441, 2654, 1681, 1795, 3212,
        ],
      },
      {
        user: users[2],
        team: 'Team B',
        durations: [
          3814, 1483, 3312, 2563, 1602, 3176, 3327, 3502, 3527, 1700, 1541, 1542, 4378, 1433, 1485,
          4775, 3211, 1640, 3136, 3925, 2680, 4447, 4708, 3120, 3335, 2520, 4043, 3187, 3884, 3407,
        ],
      },
      {
        user: users[3],
        team: 'Team C',
        durations: [
          3764, 1700, 4988, 4062, 3302, 3838, 1928, 2325, 2596, 3995, 2937, 3645, 3496, 4667, 3691,
          4563, 3848, 2203, 4608, 1770, 2820, 4330, 1422, 4502, 3403, 3384, 1803, 2001, 3741, 1933,
        ],
      },
      {
        user: users[4],
        team: 'Team A',
        durations: [
          1520, 2697, 2280, 4070, 2334, 4957, 3608, 3561, 4965, 3594, 4937, 3534, 4311, 2348, 1916,
          4877, 2044, 1381, 2018, 2076, 2080, 4721, 1995, 4874, 4785, 3775, 4522, 4726, 4627, 3034,
        ],
      },
    ],
  },
  {
    id: 8,
    project: 'E-Commerce Analytics',
    workLogs: [
      {
        user: users[1],
        team: 'Team C',
        durations: [
          2754, 2137, 4997, 1520, 3395, 3220, 1970, 1523, 1932, 3098, 4874, 1185, 1664, 3527, 3192,
          2410, 2065, 3700, 4865, 4424, 3484, 3241, 2376, 4612, 3714, 2038, 3144, 2906, 4393, 2794,
        ],
      },
      {
        user: users[2],
        team: 'Team A',
        durations: [
          1855, 4854, 4880, 4354, 2375, 1678, 3078, 4854, 4881, 3241, 4358, 4686, 1724, 1163, 4390,
          2101, 4744, 3953, 4987, 3412, 3128, 2914, 2693, 2328, 2656, 4967, 1737, 3088, 4514, 4058,
        ],
      },
      {
        user: users[3],
        team: 'Team B',
        durations: [
          4738, 2546, 3841, 2325, 2170, 3832, 3541, 1797, 4067, 1338, 2561, 1275, 1725, 2693, 4281,
          3467, 3325, 3908, 2144, 2644, 4311, 1476, 4776, 3958, 1811, 3164, 3323, 1820, 2691, 4904,
        ],
      },
      {
        user: users[4],
        team: 'Team B',
        durations: [
          1226, 4267, 4742, 1832, 1348, 2738, 1597, 3908, 1822, 4594, 1791, 3562, 4805, 2277, 2427,
          4855, 1761, 1760, 3176, 3542, 1636, 1525, 1266, 4741, 1975, 2441, 2654, 1681, 1795, 3212,
        ],
      },
    ],
  },
  {
    id: 9,
    project: 'IoT Device Management',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          3814, 1483, 3312, 2563, 1602, 3176, 3327, 3502, 3527, 1700, 1541, 1542, 4378, 1433, 1485,
          4775, 3211, 1640, 3136, 3925, 2680, 4447, 4708, 3120, 3335, 2520, 4043, 3187, 3884, 3407,
        ],
      },
      {
        user: users[2],
        team: 'Team B',
        durations: [
          3764, 1700, 4988, 4062, 3302, 3838, 1928, 2325, 2596, 3995, 2937, 3645, 3496, 4667, 3691,
          4563, 3848, 2203, 4608, 1770, 2820, 4330, 1422, 4502, 3403, 3384, 1803, 2001, 3741, 1933,
        ],
      },
      {
        user: users[3],
        team: 'Team C',
        durations: [
          1520, 2697, 2280, 4070, 2334, 4957, 3608, 3561, 4965, 3594, 4937, 3534, 4311, 2348, 1916,
          4877, 2044, 1381, 2018, 2076, 2080, 4721, 1995, 4874, 4785, 3775, 4522, 4726, 4627, 3034,
        ],
      },
      {
        user: users[4],
        team: 'Team C',
        durations: [
          4200, 3407, 4740, 4041, 2118, 4001, 1185, 1934, 3584, 1572, 3955, 1203, 4687, 2361, 4366,
          1811, 4205, 2852, 4322, 4851, 2906, 2558, 1275, 4014, 4291, 2225, 1945, 3941, 3345, 4712,
        ],
      },
    ],
  },
  {
    id: 10,
    project: 'Predictive Maintenance AI',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          4981, 2766, 3278, 3436, 3523, 4356, 3746, 2793, 4514, 4104, 4136, 4920, 4621, 2385, 3301,
          1777, 2761, 2946, 4371, 1342, 3930, 2163, 1947, 4980, 1400, 2033, 4925, 1227, 3438, 1452,
        ],
      },
      {
        user: users[2],
        team: 'Team B',
        durations: [
          2323, 2597, 3106, 4015, 4090, 3897, 1433, 1847, 3853, 1732, 2790, 2688, 3944, 4528, 1270,
          1218, 3147, 2827, 3605, 3137, 4442, 2743, 2335, 4681, 3123, 4094, 2253, 4808, 4886, 2327,
        ],
      },
      {
        user: users[3],
        team: 'Team C',
        durations: [
          5432, 7123, 4567, 6890, 3214, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789,
          7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890,
        ],
      },
      {
        user: users[4],
        team: 'Team B',
        durations: [
          4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321,
          5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789,
        ],
      },
    ],
  },
  {
    id: 11,
    project: 'Enterprise CRM System',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543,
          7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432,
        ],
      },
      {
        user: users[2],
        team: 'Team A',
        durations: [
          4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456,
          6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654,
        ],
      },
      {
        user: users[3],
        team: 'Team B',
        durations: [
          5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789,
          4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321,
        ],
      },
      {
        user: users[4],
        team: 'Team C',
        durations: [
          6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567,
          5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678,
        ],
      },
    ],
  },
  {
    id: 12,
    project: 'Cybersecurity Threat Monitoring',
    workLogs: [
      {
        user: users[1],
        team: 'Team A',
        durations: [
          7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432,
          6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543,
        ],
      },
      {
        user: users[2],
        team: 'Team A',
        durations: [
          3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789,
          7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890,
        ],
      },
      {
        user: users[3],
        team: 'Team B',
        durations: [
          6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654,
          4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456,
        ],
      },
      {
        user: users[4],
        team: 'Team C',
        durations: [
          4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321,
          5678, 6543, 7890, 3456, 6789, 4567, 5432, 6789, 7654, 4321, 5678, 6543, 7890, 3456, 6789,
        ],
      },
    ],
  },
];

export const projects = [
  { id: 1, label: 'Smart Workflow System' },
  { id: 2, label: 'ByteVista – Data Analytics Suite' },
  { id: 3, label: 'Cloud Integration Hub' },
  { id: 4, label: 'Cloud Networking UI' },
  { id: 5, label: 'DevOps Management' },
  { id: 6, label: 'NexaFlow – Smart Workflow System' },
  { id: 7, label: 'AI-Powered Chatbot' },
];

export const tasks = [
  {
    id: 1,
    resourceId: 1,
    from: dayjs().hour(9).minute(0).second(0).valueOf(),
    to: dayjs().hour(12).minute(0).second(0).valueOf(),
    label: 'Fix misalignment in buttons on all screen sizes',
    assignees: [users[1], users[2], users[5]],
    category: 'development',
  },
  {
    id: 2,
    resourceId: 1,
    from: dayjs().hour(12).minute(40).second(0).valueOf(),
    to: dayjs().hour(15).minute(20).second(0).valueOf(),
    label: 'Redesign navbar for better user experience',
    assignees: [users[0], users[3]],
    category: 'design',
  },
  {
    id: 3,
    resourceId: 1,
    from: dayjs().hour(15).minute(30).second(0).valueOf(),
    to: dayjs().hour(19).minute(0).second(0).valueOf(),
    label: 'Develop Initial Prototype 01',
    assignees: [users[4], users[5]],
    category: 'research',
  },
  {
    id: 4,
    resourceId: 2,
    from: dayjs().hour(12).minute(20).second(0).valueOf(),
    to: dayjs().hour(15).minute(10).second(0).valueOf(),
    label: 'Develop Initial Prototype 02',
    assignees: [users[6], users[7]],
    category: 'support',
  },
  {
    id: 5,
    resourceId: 2,
    from: dayjs().hour(16).minute(30).second(0).valueOf(),
    to: dayjs().hour(20).minute(0).second(0).valueOf(),
    label: 'Implement a dark mode toggle with smooth UI',
    assignees: [users[1], users[5], users[8], users[9]],
    category: 'testing',
  },
  {
    id: 6,
    resourceId: 3,
    from: dayjs().hour(9).minute(0).second(0).valueOf(),
    to: dayjs().hour(12).minute(20).second(0).valueOf(),
    label: 'Fix misalignment in buttons on all screen sizes',
    assignees: [users[2], users[7], users[8]],
    category: 'research',
  },
  {
    id: 7,
    resourceId: 3,
    from: dayjs().hour(13).minute(20).second(0).valueOf(),
    to: dayjs().hour(17).minute(0).second(0).valueOf(),
    label: 'Update typography for improved readability',
    assignees: [users[5], users[9]],
    category: 'development',
  },
  {
    id: 8,
    resourceId: 4,
    from: dayjs().hour(9).minute(0).second(0).valueOf(),
    to: dayjs().hour(11).minute(40).second(0).valueOf(),
    label: 'Refactor CSS classes to improve maintainability',
    assignees: [users[8], users[10]],
    category: 'design',
  },
  {
    id: 9,
    resourceId: 4,
    from: dayjs().hour(13).minute(50).second(0).valueOf(),
    to: dayjs().hour(19).minute(0).second(0).valueOf(),
    label: 'Add smooth page transitions for better UX',
    assignees: [users[4], users[8], users[11], users[13], users[15]],
    category: 'testing',
  },
  {
    id: 10,
    resourceId: 5,
    from: dayjs().hour(9).minute(0).second(0).valueOf(),
    to: dayjs().hour(12).minute(50).second(0).valueOf(),
    label: 'Implement lazy loading for offscreen images',
    assignees: [users[5], users[14]],
    category: 'support',
  },
  {
    id: 11,
    resourceId: 5,
    from: dayjs().hour(14).minute(20).second(0).valueOf(),
    to: dayjs().hour(18).minute(50).second(0).valueOf(),
    label: 'Improve error messages for better clarity',
    assignees: [users[12], users[15]],
    category: 'research',
  },
  {
    id: 12,
    resourceId: 6,
    from: dayjs().hour(12).minute(0).second(0).valueOf(),
    to: dayjs().hour(16).minute(0).second(0).valueOf(),
    label: 'Redesign card layout for better visual appeal',
    assignees: [users[7], users[10], users[11]],
    category: 'research',
  },
  {
    id: 13,
    resourceId: 6,
    from: dayjs().hour(17).minute(30).second(0).valueOf(),
    to: dayjs().hour(21).minute(30).second(0).valueOf(),
    label: 'Add animations for a more interactive UI',
    assignees: [users[13], users[15]],
    category: 'support',
  },
  {
    id: 14,
    resourceId: 7,
    from: dayjs().hour(9).minute(0).second(0).valueOf(),
    to: dayjs().hour(12).minute(20).second(0).valueOf(),
    label: 'Fix modal close button not working properly',
    assignees: [users[9], users[12], users[15]],
    category: 'design',
  },
  {
    id: 15,
    resourceId: 7,
    from: dayjs().hour(13).minute(10).second(0).valueOf(),
    to: dayjs().hour(16).minute(40).second(0).valueOf(),
    label: 'Develop Initial Prototype 03',
    assignees: [users[10], users[14]],
    category: 'testing',
  },
  {
    id: 16,
    resourceId: 7,
    from: dayjs().hour(17).minute(10).second(0).valueOf(),
    to: dayjs().hour(19).minute(40).second(0).valueOf(),
    label: 'Develop Initial Prototype 04',
    assignees: [users[9], users[12]],
    category: 'development',
  },
];

export const timeRanges = [
  {
    id: 1,
    from: dayjs().hour(9).minute(30).second(0).valueOf(),
    to: dayjs().hour(10).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 2,
    from: dayjs().hour(10).minute(30).second(0).valueOf(),
    to: dayjs().hour(11).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 3,
    from: dayjs().hour(11).minute(30).second(0).valueOf(),
    to: dayjs().hour(12).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 4,
    from: dayjs().hour(12).minute(30).second(0).valueOf(),
    to: dayjs().hour(13).minute(30).second(0).valueOf(),
    resizable: false,
  },

  {
    id: 5,
    from: dayjs().hour(13).minute(30).second(0).valueOf(),
    to: dayjs().hour(14).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 6,
    from: dayjs().hour(14).minute(30).second(0).valueOf(),
    to: dayjs().hour(15).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 7,
    from: dayjs().hour(15).minute(30).second(0).valueOf(),
    to: dayjs().hour(16).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 8,
    from: dayjs().hour(16).minute(30).second(0).valueOf(),
    to: dayjs().hour(17).minute(30).second(0).valueOf(),
    resizable: false,
  },

  {
    id: 9,
    from: dayjs().hour(17).minute(30).second(0).valueOf(),
    to: dayjs().hour(18).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 10,
    from: dayjs().hour(18).minute(30).second(0).valueOf(),
    to: dayjs().hour(19).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 11,
    from: dayjs().hour(19).minute(30).second(0).valueOf(),
    to: dayjs().hour(20).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 12,
    from: dayjs().hour(20).minute(30).second(0).valueOf(),
    to: dayjs().hour(21).minute(30).second(0).valueOf(),
    resizable: false,
  },
  {
    id: 13,
    from: dayjs().hour(21).minute(30).second(0).valueOf(),
    to: dayjs().hour(22).minute(30).second(0).valueOf(),
    resizable: false,
  },
];
