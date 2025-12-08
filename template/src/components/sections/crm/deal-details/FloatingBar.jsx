import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const FloatingBar = ({ contactInfo, handleDrawerOpen }) => {
  const { up } = useBreakpoints();

  const upSm = up('sm');

  return (
    <Paper
      elevation={6}
      variant="elevation"
      sx={{
        p: 1,
        pl: 2,
        display: { lg: 'none' },
        borderRadius: 3,
        maxWidth: { xs: 'calc(100% - 48px)', md: 600 },
        width: 1,
        position: 'fixed',
        zIndex: 1000,
        bottom: 80,
        left: { xs: 24, md: `55%` },
        right: { xs: 24, md: '50%' },
        transform: { md: 'translate(-50%, 0)' },
      }}
    >
      <Stack gap={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack gap={2} sx={{ overflow: 'hidden', flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: 'neutral.dark',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Replica Badidas Futbol
          </Typography>
          {upSm && (
            <Stack gap={1}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                {contactInfo.type}:
              </Typography>
              <Chip
                label={contactInfo.people[0].name}
                avatar={
                  <Avatar src={contactInfo.people[0].avatar} sx={{ width: 16, height: 16 }} />
                }
                variant="soft"
                onDelete={contactInfo.people[0].editable ? () => {} : undefined}
                deleteIcon={
                  contactInfo.people[0].editable ? (
                    <IconifyIcon icon="material-symbols:edit-outline" />
                  ) : undefined
                }
              />
            </Stack>
          )}
        </Stack>
        <Button
          variant="soft"
          color="neutral"
          onClick={handleDrawerOpen}
          sx={{ textWrap: 'nowrap' }}
        >
          More details
        </Button>
      </Stack>
    </Paper>
  );
};

export default FloatingBar;
