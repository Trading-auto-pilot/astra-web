import { Avatar } from '@mui/material';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { initialConfig } from 'config';
import { users } from 'data/users';
import dayjs from 'dayjs';
import { currencyFormat, generateUniqueId, getPercentageStr } from 'lib/utils';
import Logo from 'components/common/Logo';

const image = (index) => `${initialConfig.assetsDir}/images/crm/deal-details/${index}.webp`;
const audio = (name) => `${initialConfig.assetsDir}/audio/${name}.mp3`;

export const dealInformation = [
  {
    id: 1,
    attribute: 'Last updated',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        {dayjs('2025-01-23').format('DD MMM, YYYY')}
      </Typography>
    ),
    background: true,
  },
  {
    id: 2,
    attribute: 'Deal Details',
    value: (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Saying 'I notice you're a nerd' is like saying, 'Hey, I notice that you'd rather be
        intelligent than be stupid, that you'd rather be thoughtful than be vapid, that you believe
        that there are things that matter more than the arrest record
      </Typography>
    ),
    background: false,
  },
  {
    id: 3,
    attribute: 'Create Date',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        {dayjs('2025-01-23').format('DD MMM, YYYY')}
      </Typography>
    ),
    background: true,
  },
  {
    id: 4,
    attribute: 'Created By',
    value: (
      <Chip
        label="Gerard P."
        avatar={<Avatar src={users[7].avatar} sx={{ width: 16, height: 16 }} />}
        variant="soft"
      />
    ),
    background: false,
  },
  {
    id: 5,
    attribute: 'Current Stage',
    value: <Chip label="Presentation Scheduled" variant="soft" color="warning" />,
    background: true,
  },
  {
    id: 6,
    attribute: 'Closing Date',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        {dayjs('2025-01-23').format('DD MMM, YYYY')}
      </Typography>
    ),
    background: false,
  },
  {
    id: 7,
    attribute: 'Associated Contact',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'primary.main', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        Tsamina Mina
      </Typography>
    ),
    background: true,
  },
  {
    id: 8,
    attribute: 'Priority',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        not set
      </Typography>
    ),
    background: false,
  },
  {
    id: 9,
    attribute: 'Deal Owner',
    value: (
      <Chip
        label="Gerard P."
        avatar={<Avatar src={users[7].avatar} sx={{ width: 16, height: 16 }} />}
        variant="soft"
      />
    ),
    background: true,
  },
  {
    id: 10,
    attribute: 'Collaborating Agents',
    value: (
      <Chip
        label="Isaac N."
        avatar={<Avatar src={users[11].avatar} sx={{ width: 16, height: 16 }} />}
        variant="soft"
      />
    ),
    background: false,
  },
  {
    id: 11,
    attribute: 'Budget Forecast',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        {currencyFormat(105000)}
      </Typography>
    ),
    background: true,
  },
  {
    id: 12,
    attribute: 'Forecast Category',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        Best Case
      </Typography>
    ),
    background: false,
  },
  {
    id: 13,
    attribute: 'Deal Probability',
    value: (
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', textDecoration: 'underline', textUnderlineOffset: 2 }}
      >
        {getPercentageStr(35)}
      </Typography>
    ),
    background: true,
  },
];

export const activitySummary = {
  summary: [
    { id: 'call', icon: 'material-symbols:call-outline', attribute: 'Calls', value: 2 },
    { id: 'email', icon: 'material-symbols:mail-outline', attribute: 'Emails', value: 3 },
    { id: 'meeting', icon: 'material-symbols:group-outline', attribute: 'Meeting', value: 3 },
  ],
  timeline: [
    {
      id: 1,
      title: 'Meeting with Client',
      description: 'Discussed project scope and deliverables',
      date: dayjs('2025-01-21').format('DD MMM, YYYY'),
    },
    {
      id: 2,
      title: 'Email Follow-up',
      description: 'Sent proposal updates, awaiting feedback',
      date: dayjs('2025-01-23').format('DD MMM, YYYY'),
    },
    {
      id: 3,
      title: 'Phone Call',
      description: 'Confirmed pricing, clarified timeline',
      date: dayjs('2025-01-23').format('DD MMM, YYYY'),
    },
    {
      id: 4,
      title: 'Upcoming Actions',
      description: 'Finalize contract, discuss next steps',
      date: dayjs('2025-01-30').format('DD MMM, YYYY'),
    },
  ],
};

export const analyticsData = [
  { value: 16, name: 'Deal Progress' },
  { value: 28, name: 'Win/Loss Ratio' },
  { value: 22, name: 'Conversion Rate' },
  { value: 34, name: 'Engagement Metrices' },
];

export const salesPipelineData = [
  { id: 1, name: 'Contact', status: 'done' },
  { id: 2, name: 'MQL', status: 'done' },
  { id: 3, name: 'SQL', status: 'done' },
  { id: 4, name: 'Chance', status: 'done' },
  { id: 5, name: 'W/L', status: 'ongoing' },
];

export const assignedToData = [
  {
    type: 'Deal Owner',
    people: [{ id: 1, name: 'Gerard P.', avatar: users[1].avatar, editable: true }],
  },
  {
    type: 'Collaborator',
    people: [{ id: 2, name: 'Muzan K.', avatar: users[14].avatar, editable: false }],
  },
  {
    type: 'Follower',
    people: [
      { id: 3, name: 'Haddock. C', avatar: users[4].avatar, editable: false },
      { id: 4, name: 'K. Naan', avatar: users[12].avatar, editable: false },
    ],
  },
];

export const accountData = {
  name: 'Waka Waka PLC',
  dateCreated: dayjs('1897-01-01').toDate(),
  logo: `${initialConfig.assetsDir}/images/brands/5.webp`,
  tags: ['Fashion', 'Sportswear'],
  contactIcons: [
    'material-symbols:location-on-outline',
    'material-symbols:globe',
    'material-symbols:mail-outline',
    'material-symbols:call-outline',
  ],
  ongoingDeals: [
    {
      name: 'Replica Badidas Futbol',
      budget: 105000,
      state: 'ongoing',
      closingDate: dayjs('2025-09-19').toDate(),
    },
    {
      name: 'Replica Pumba Jersey',
      budget: 85000,
      state: 'ongoing',
      closingDate: dayjs('2024-12-07').toDate(),
    },
  ],
  pastDeals: [
    { name: 'Almost Original Mike Boots', budget: 95000, state: 'past', status: 'closed' },
    { name: 'Original Niqe Boots', budget: 85000, state: 'past', status: 'lost' },
  ],
};

export const associatedContactData = [
  {
    id: 1,
    name: 'Tsamina Mina',
    avatar: users[6].avatar,
    designation: 'VP Operations',
    company: 'Waka Waka PLC',
    contactInfo: {
      phone: '+33 6 78 09 34 90',
      email: 'example_1@email.com',
      contactOwner: [{ id: 1, name: 'Gerard P.', avatar: users[7].avatar }],
    },
  },
];

export const allActivities = [
  {
    id: generateUniqueId(),
    date: dayjs().subtract(5, 'hour').subtract(51, 'minute').toISOString(),
    activities: [
      {
        id: generateUniqueId(),
        type: 'mail',
        title: 'Sent 1 mail to the contact',
        color: 'primary',
        user: 'Sampro',
        icon: 'material-symbols:outgoing-mail-outline-rounded',
        assignment: 'Muaz',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'meeting',
        title: 'Onboarding Meeting with',
        color: 'info',
        user: 'Mariyam',
        icon: 'material-symbols:videocam-outline-rounded',
        assignment: 'Donrai',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'call',
        title: 'Purchasing-Related Vendors with',
        color: 'error',
        user: 'Mariyam',
        icon: 'material-symbols:phone-in-talk-outline-rounded',
        assignment: 'Muaz',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'mail',
        title: 'Sent 1 mail to the contact',
        color: 'primary',
        user: 'Sampro',
        icon: 'material-symbols:outgoing-mail-outline-rounded',
        assignment: 'Samdoe',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'attachment',
        title: 'Added image in the Project',
        color: 'success',
        user: 'Ansolo Lazinatov',
        icon: 'material-symbols:attach-file-rounded',
        assignment: 'Project nothingum',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'note',
        title: 'Assigned as a director for the Project nothingum',
        color: 'warning',
        user: 'Netnai Pollock',
        icon: 'material-symbols:edit-note-outline-rounded',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'task',
        title: 'Designing the dungeon',
        color: 'success',
        user: 'Dorbesh Baba',
        icon: 'material-symbols:add-task-rounded',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'mail',
        title: 'Sent 1 mail to the contact',
        color: 'primary',
        user: 'Sampro',
        icon: 'material-symbols:outgoing-mail-outline-rounded',
        assignment: 'Muaz',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'attachment',
        title: 'Added note in the Project',
        color: 'success',
        user: 'Ansolo Lazinatov',
        icon: 'material-symbols:attach-file-rounded',
        assignment: 'Project nothingum',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'call',
        title: 'Purchasing-Related Vendors with',
        color: 'error',
        user: 'Mariyam',
        icon: 'material-symbols:phone-in-talk-outline-rounded',
        assignment: 'Muaz',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'note',
        title: 'Assigned as a director for the Project nothingum',
        color: 'warning',
        user: 'Netnai Pollock',
        icon: 'material-symbols:edit-note-outline-rounded',
        timeStamp: dayjs().format(),
      },
    ],
  },
  {
    id: generateUniqueId(),
    date: dayjs()
      .subtract(1, 'year')
      .add(5, 'month')
      .subtract(5, 'hour')
      .subtract(51, 'minute')
      .toISOString(),
    activities: [
      {
        id: generateUniqueId(),
        type: 'mail',
        title: 'Sent 1 mail to the contact',
        color: 'primary',
        user: 'Sampro',
        icon: 'material-symbols:outgoing-mail-outline-rounded',
        assignment: 'Muaz',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'call',
        title: 'Purchasing-Related Vendors with',
        color: 'error',
        user: 'Mariyam',
        icon: 'material-symbols:phone-in-talk-outline-rounded',
        assignment: 'Muaz',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'attachment',
        title: 'Added note in the Project',
        color: 'success',
        user: 'Ansolo Lazinatov',
        icon: 'material-symbols:attach-file-rounded',
        assignment: 'Project nothingum',
        timeStamp: dayjs().format(),
      },
    ],
  },
  {
    id: generateUniqueId(),
    date: dayjs()
      .subtract(1, 'year')
      .add(5, 'month')
      .subtract(4, 'day')
      .subtract(5, 'hour')
      .subtract(51, 'minute')
      .toISOString(),
    activities: [
      {
        id: generateUniqueId(),
        type: 'meeting',
        title: 'Onboarding Meeting with',
        color: 'info',
        user: 'Mariyam',
        icon: 'material-symbols:videocam-outline-rounded',
        assignment: 'Donrai',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'mail',
        title: 'Sent 1 mail to the contact',
        color: 'primary',
        user: 'Sampro',
        icon: 'material-symbols:outgoing-mail-outline-rounded',
        assignment: 'Muaz',
        timeStamp: dayjs().format(),
      },
      {
        id: generateUniqueId(),
        type: 'note',
        title: 'Assigned as a director for the Project nothingum',
        color: 'warning',
        user: 'Netnai Pollock',
        icon: 'material-symbols:edit-note-outline-rounded',
        timeStamp: dayjs().format(),
      },
    ],
  },
];

export const emailData = [
  {
    id: generateUniqueId(),
    name: 'Tsamina Mina',
    avatar: users[6].avatar,
    sentAt: dayjs().format(),
    message: (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Hello ,
        <br />
        <br />
        You are a good soldier, carefully choosing your battles and always ready to pick yourself up
        and dust yourself off and back in the saddle when knocked down.
        <br />
        <br />
        Best regards,
        <br />
        Tsamina Mina
      </Typography>
    ),
  },
  {
    id: generateUniqueId(),
    name: 'Gerard P.',
    avatar: <Logo showName={false} />,
    sentVia: 'Aurora Campaign Manager',
    sentAt: dayjs().format(),
    message: (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Hello Tsamina Mina,
        <br />
        <br />
        Thank you. Positioned at the front line, all eyes are on you, aware of the gravity as we are
        getting closer-- this fight is not over.
        <br />
        The pressure mounts, you are feeling it, but you possess everything needed to prevail.
        <br />
        <br />
        Embrace the belief that when you fall, you can get up. And if you fall, you definitely will
        get up.
        <br />
        <br />
        Best regards,
        <br />
        Team Aurora.
      </Typography>
    ),
    attachment: [{ src: image(1), name: 'screenshot.jpg', size: '16.2kb' }],
  },
  {
    id: generateUniqueId(),
    name: 'Tsamina Mina',
    avatar: users[6].avatar,
    sentAt: dayjs().format(),
    message: (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Hello Gerard P,
        <br />
        <br />
        You are a good soldier, carefully choosing your battles and always ready to pick yourself up
        and dust yourself off and back in the saddle when knocked down. Positioned at the front
        line, all eyes are on you, aware of the gravity as we are getting closer.
        <br />
        <br />
        Best regards,
        <br />
        Tsamina Mina
      </Typography>
    ),
  },
  {
    id: generateUniqueId(),
    name: 'Gerard P.',
    avatar: <Logo showName={false} />,
    sentVia: 'Aurora Campaign Manager',
    sentAt: dayjs().format(),
    message: (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Hello ,
        <br />
        <br />
        Kept in sent gave feel will oh it we. Has pleasure procured men laughing shutters nay. Old
        insipidity motionless continuing law shy partiality. Depending acuteness dependent eat use
        dejection. Unpleasing astonished discovered not nor shy. Morning hearted now met yet beloved
        evening. Has and upon his last here must.
        <br />
        <br />
        Breakfast procuring nay end happiness allowance assurance frankness. Met simplicity nor
        difficulty unreserved who. Entreaties mr conviction dissimilar me astonished estimating
        cultivated. On no applauded exquisite my additions. Pronounce add boy estimable nay
        suspected. You sudden nay elinor thirty esteem temper. Quiet leave shy you gay off asked
        large style.
        <br />
        <br />
        Fulfilled direction use continual set him propriety continued. Saw met applauded favourite
        deficient engrossed concealed and her. Concluded boy perpetual old supposing. Farther
        related bed and passage comfort civilly. Dashwoods see frankness objection abilities the. As
        hastened oh produced prospect formerly up am. Placing forming nay looking old married few
        has. Margaret disposed add screened rendered six say his striking confined
        <br />
        <br />
        Best regards,
        <br />
        Team Aurora.
      </Typography>
    ),
    files: [
      {
        type: 'image',
        file: {
          name: 'Image.jpeg',
          size: '35.5kb',
          format: 'jpeg',
          src: image(2),
        },
      },
      {
        type: 'file',
        file: {
          name: 'File.pdf',
          size: '35.5kb',
          format: 'pdf',
        },
      },
    ],
  },
  {
    id: generateUniqueId(),
    name: 'Tsamina Mina',
    avatar: users[6].avatar,
    sentAt: dayjs().format(),
    message: (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Hello Gerard P,
        <br />
        <br />
        Admiration stimulated cultivated reasonable be projection possession of. Real no near room
        ye bred sake if some. Is arranging furnished knowledge agreeable so. Fanny as smile up
        small. It vulgar chatty simple months turned oh at change of. Astonished set expression
        solicitude way admiration.
        <br />
        <br />
        Best regards,
        <br />
        Tsamina Mina
      </Typography>
    ),
  },
  {
    id: generateUniqueId(),
    name: 'Gerard P.',
    avatar: <Logo showName={false} />,
    sentVia: 'Aurora Campaign Manager',
    sentAt: dayjs().format(),
    message: (
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        Hello ,
        <br />
        <br />
        Kept in sent gave feel will oh it we. Has pleasure procured men laughing shutters nay. Old
        insipidity motionless continuing law shy partiality. Depending acuteness dependent eat use
        dejection.
        <br />
        <br />
        Best regards,
        <br />
        Team Aurora.
      </Typography>
    ),
    files: [],
  },
];

export const meetingData = [
  {
    id: generateUniqueId(),
    date: dayjs().toISOString(),
    meetings: [
      {
        id: generateUniqueId(),
        participant: 'Muaz',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[2], users[1], users[3], users[12], users[13]],
      },
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[15], users[5], users[13]],
      },
    ],
  },
  {
    id: generateUniqueId(),
    date: dayjs().add(1, 'day').toISOString(),
    meetings: [
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[2], users[1], users[3], users[12], users[13]],
      },
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[2], users[1], users[3], users[12], users[13]],
      },
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[2], users[1], users[3], users[12], users[13]],
      },
    ],
  },
  {
    id: generateUniqueId(),
    date: dayjs().subtract(4, 'day').toISOString(),
    meetings: [
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[2], users[1], users[3], users[12], users[13], users[14], users[0], users[1]],
      },
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[15], users[5], users[13]],
      },
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [
          users[14],
          users[8],
          users[13],
          users[12],
          users[0],
          users[1],
          users[2],
          users[3],
          users[4],
          users[5],
          users[6],
          users[7],
          users[9],
        ],
      },
      {
        id: generateUniqueId(),
        participant: 'Mariyam',
        scheduledBy: 'Gerard P.',
        scheduledDate: dayjs().toISOString(),
        guests: [users[4], users[8], users[5], users[7]],
      },
    ],
  },
];

export const callLogData = [
  {
    id: generateUniqueId(),
    date: dayjs().toISOString(),
    calls: [
      {
        id: generateUniqueId(),
        caller: 'Gerard P.',
        receiver: 'Tsamina Mina',
        duration: 259,
        audioSrc: audio('akai-namida-instrumental'),
        time: dayjs().toISOString(),
        transcript: [
          {
            id: 1,
            user: 'agent',
            message: 'Would you tell me, please, which way I ought to go from here?',
          },
          {
            id: 2,
            user: 'client',
            message: 'That depends a good deal on where you want to get to.',
          },
          {
            id: 3,
            user: 'agent',
            message: "I don't much care where.",
          },
          {
            id: 4,
            user: 'client',
            message: "Then it doesn't much matter which way you go.",
          },
          {
            id: 5,
            user: 'agent',
            message: '...So long as I get somewhere.',
          },
          {
            id: 6,
            user: 'client',
            message: "Oh, you're sure to do that, if only you walk long enough.” ",
          },
          {
            id: 7,
            user: 'agent',
            message: "But I don't want to go among mad people.",
          },
          {
            id: 8,
            user: 'client',
            message: "Oh, you can't help that,\nwe're all mad here.\n ...\n I'm mad. You're mad.",
          },
          {
            id: 9,
            user: 'agent',
            message: 'How do you know I’m mad?',
          },
          {
            id: 10,
            user: 'client',
            message: 'You must be,\nor you wouldn’t have come here.',
          },
        ],
      },
      {
        id: generateUniqueId(),
        caller: 'Gerard P.',
        receiver: 'Tsamina Mina',
        duration: 288,
        audioSrc: audio('triangle-instrumental'),
        time: dayjs().toISOString(),
        transcript: [],
      },
    ],
  },
];

export const tasksData = [
  {
    id: generateUniqueId(),
    title: 'Marketing Campaign',
    taskList: [
      {
        id: generateUniqueId(),
        title: 'Finalize Ad Creatives',
        completed: false,
        timeStamp: dayjs().format(),
        people: [],
      },
      {
        id: generateUniqueId(),
        title: 'Schedule Social Media Posts',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[15], users[14]],
      },
      {
        id: generateUniqueId(),
        title: 'Approve Email Newsletter',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[8]],
      },
      {
        id: generateUniqueId(),
        title: 'Analyze Audience Engagement',
        completed: true,
        timeStamp: dayjs().format(),
        people: [users[2]],
      },
    ],
  },
  {
    id: generateUniqueId(),
    title: 'Product Development',
    taskList: [
      {
        id: generateUniqueId(),
        title: 'Review UI/UX Wireframes',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[2]],
      },
      {
        id: generateUniqueId(),
        title: 'Conduct Beta Testing',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[14], users[13]],
      },
      {
        id: generateUniqueId(),
        title: 'Implement Feedback Changes',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[11]],
      },
      {
        id: generateUniqueId(),
        title: 'Finalize Product Roadmap',
        completed: true,
        timeStamp: dayjs().format(),
        people: [],
      },
    ],
  },
  {
    id: generateUniqueId(),
    title: 'Client Onboarding',
    taskList: [
      {
        id: generateUniqueId(),
        title: 'Gather Client Requirements',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[2]],
      },
      {
        id: generateUniqueId(),
        title: 'Set Up Client Account',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[14], users[13]],
      },
      {
        id: generateUniqueId(),
        title: 'Conduct Initial Traning Session',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[11]],
      },
      {
        id: generateUniqueId(),
        title: 'Assign Account Manager',
        completed: true,
        timeStamp: dayjs().format(),
        people: [],
      },
      {
        id: generateUniqueId(),
        title: 'Collect Feedback & Adjust Services',
        completed: true,
        timeStamp: dayjs().format(),
        people: [],
      },
    ],
  },
  {
    id: generateUniqueId(),
    title: 'Software Update',
    taskList: [
      {
        id: generateUniqueId(),
        title: 'Identity & Document Required Changes',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[2]],
      },
      {
        id: generateUniqueId(),
        title: 'Develop & Test New Features',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[14], users[13]],
      },
      {
        id: generateUniqueId(),
        title: 'Perform Bug Fixes & Security Patches',
        completed: false,
        timeStamp: dayjs().format(),
        people: [users[11]],
      },
      {
        id: generateUniqueId(),
        title: 'Conduct Internal QA Testing',
        completed: true,
        timeStamp: dayjs().format(),
        people: [],
      },
      {
        id: generateUniqueId(),
        title: 'Release Update to Staging Environment',
        completed: true,
        timeStamp: dayjs().format(),
        people: [],
      },
      {
        id: generateUniqueId(),
        title: 'Deploy Update to Production',
        completed: true,
        timeStamp: dayjs().format(),
        people: [],
      },
      {
        id: generateUniqueId(),
        title: 'Monitor Performance & Gather User Feedback',
        completed: true,
        timeStamp: dayjs().format(),
        people: [],
      },
    ],
  },
];

const notes = [
  {
    id: generateUniqueId(),
    title: 'Feedback on trial',
    author: { avatar: users[5].avatar, name: 'Olivia Carter' },
    createdAt: dayjs()
      .subtract(1, 'month')
      .subtract(4, 'day')
      .subtract(5, 'hour')
      .subtract(51, 'minute')
      .toISOString(),
    description:
      'A CRM should guide users naturally, like a well-written book. If users need to hunt for basic actions or get lost in too many options, the design is failing them. The best UI feels invisible—users just know what to do next.',
  },
  {
    id: generateUniqueId(),
    title: 'Feedback on trial',
    author: { avatar: users[4].avatar, name: 'James Wilson' },
    createdAt: dayjs()
      .subtract(1, 'month')
      .subtract(4, 'day')
      .subtract(6, 'hour')
      .subtract(33, 'minute')
      .toISOString(),
    description:
      "A well-designed system should guide users naturally, just like a well-structured narrative. If someone has to pause and think too much about where to click or how to complete an action, the design isn't working as intended. The best user experiences feel seamless—people should instinctively understand the next steps without needing to search through menus or instructions. When the interface is intuitive, users feel in control and can complete their tasks efficiently. Clarity, simplicity, and logical flow are the key ingredients of an interface that “tells a story” users can follow without friction.",
  },
  {
    id: generateUniqueId(),
    title: 'Feedback on trial',
    author: { avatar: users[3].avatar, name: 'Lucas Taylor' },
    createdAt: dayjs()
      .subtract(1, 'month')
      .subtract(4, 'day')
      .subtract(2, 'hour')
      .subtract(17, 'minute')
      .toISOString(),
    description:
      'Notifications should add value, not noise. When a system bombards users with constant alerts, messages, or reminders, it becomes overwhelming and counterproductive. Instead of helping, excessive notifications create stress and lead to important updates being ignored. The best approach is to provide control—allowing users to prioritize what’s urgent, what requires their attention later, and what can be muted altogether. Clear categorization, smart grouping, and personalized settings can turn notifications from a distraction into a helpful guide.',
  },
  {
    id: generateUniqueId(),
    title: 'Feedback on trial',
    author: { avatar: users[7].avatar, name: 'Gerard P.' },
    createdAt: dayjs()
      .subtract(1, 'month')
      .subtract(4, 'day')
      .subtract(11, 'hour')
      .subtract(5, 'minute')
      .toISOString(),
    description:
      'Every field, button, and tab should serve a clear purpose. If users have to sift through unnecessary information or redundant features, their efficiency drops. Less is often more.',
  },
];

export const activityMonitoringData = {
  allActivities: allActivities,
  email: emailData,
  meeting: meetingData,
  callLog: callLogData,
  tasks: tasksData,
  notes: notes,
};
