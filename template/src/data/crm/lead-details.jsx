import { Avatar, Chip, Link, Typography } from '@mui/material';
import { users } from 'data/users';
import { generateUniqueId } from 'lib/utils';
import CopyableText from 'components/sections/crm/common/CopyableText';

export const contactInfoData = [
  { attribute: 'Title', value: <Typography variant="body2">VP, Operations</Typography> },
  {
    attribute: 'Account',
    value: (
      <Typography component={Link} href="#!" underline="hover" variant="body2">
        Waka Waka PLC
      </Typography>
    ),
  },
  { attribute: 'Lead Source', value: <Typography variant="body2">Organic</Typography> },
  {
    attribute: 'Email',
    value: <CopyableText text="example_1@gmail.com" link href="mailto:example_1@gmail.com" />,
  },
  {
    attribute: 'Phone No.',
    value: <CopyableText text="+33 6 78 09 34 90" link href="tel:+33 6 78 09 34 90" />,
  },
  {
    attribute: 'Contact Owner',
    value: <Chip label="Gerard P." avatar={<Avatar src={users[7].avatar} />} variant="soft" />,
  },
];

export const ongoingDealsData = [
  {
    id: generateUniqueId(),
    name: 'Replica Badidas Futbol',
    budget: 465000,
    closingDate: '2025-09-21',
    phases: [
      { name: 'Contact', status: 'done' },
      { name: 'MQL', status: 'ongoing' },
      { name: 'SQL', status: 'closed' },
      { name: 'Chance', status: 'closed' },
      { name: 'W/L', status: 'closed' },
    ],
  },
  {
    id: generateUniqueId(),
    name: 'Pumba Jersey Project',
    budget: 105000,
    closingDate: '2025-09-19',
    phases: [
      { name: 'Contact', status: 'done' },
      { name: 'MQL', status: 'done' },
      { name: 'SQL', status: 'done' },
      { name: 'Chance', status: 'done' },
      { name: 'W/L', status: 'ongoing' },
    ],
  },
  {
    id: generateUniqueId(),
    name: 'Almost Original Mike Boots',
    budget: 250000,
    closingDate: 'closed',
    phases: [
      { name: 'Contact', status: 'done' },
      { name: 'MQL', status: 'done' },
      { name: 'SQL', status: 'done' },
      { name: 'Chance', status: 'done' },
      { name: 'W/L', status: 'done' },
    ],
  },
];
