import { Avatar, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { users } from 'data/users';
import IconifyIcon from 'components/base/IconifyIcon';
import DashboardMenu from 'components/common/DashboardMenu';

const notes = [
  {
    id: 0,
    author: users[0],
    message:
      'Candidate passed resume screening. Strong academic background and relevant experience in SaaS. Scheduled for technical interview on May 2nd.',
    createdAt: 'Today at 12:10pm',
  },
  {
    id: 1,
    author: users[1],
    message:
      'Tech panel provided positive feedback. Team feels candidate is a good culture fit. Awaiting final round availability from candidate.',
    createdAt: 'Today at 12:10pm',
  },
  {
    id: 2,
    author: users[2],
    message:
      'Discussed compensation expectations. Slightly above our range but within flexibility. Offer letter prep in progress.',
    createdAt: 'Today at 12:10pm',
  },
  {
    id: 3,
    author: users[3],
    message:
      'Candidate officially accepted the offer. Start date confirmed for June 10. Add to onboarding tracker.',
    createdAt: 'Today at 12:10pm',
  },
];

const Notes = () => {
  return (
    <div>
      <Box sx={{ py: 3, textAlign: 'right' }}>
        <Stack gap={2} mb={1}>
          <Avatar variant="circular" src={users[15].avatar} sx={{ height: 48, width: 48 }} />

          <TextField fullWidth label="Add your Preview" multiline rows={2} />
        </Stack>

        <Button variant="contained" sx={{ minWidth: 120 }}>
          Save
        </Button>
      </Box>

      {notes.map((note) => {
        return (
          <Stack
            key={note.id}
            gap={2}
            sx={{ position: 'relative', py: 3, borderTop: 1, borderColor: 'dividerLight' }}
          >
            <Stack gap={0.5} sx={{ position: 'absolute', right: 0, top: 24 }}>
              <Button shape="square" size="small" variant="soft" color="neutral">
                <IconifyIcon icon="material-symbols:edit-outline" />
              </Button>

              <DashboardMenu
                variant="soft"
                icon={<IconifyIcon icon="material-symbols:more-vert" />}
              />
            </Stack>
            <Avatar variant="circular" src={note.author.avatar} sx={{ height: 48, width: 48 }} />

            <div>
              <Box mb={2}>
                <Typography variant="subtitle2" fontWeight={700} mb={0.5}>
                  {note.author.name}
                </Typography>
                <Typography variant="caption" component="p" color="textSecondary">
                  {note.createdAt}
                </Typography>
              </Box>

              <Typography variant="body2" color="textSecondary">
                {note.message}
              </Typography>
            </div>
          </Stack>
        );
      })}
    </div>
  );
};

export default Notes;
