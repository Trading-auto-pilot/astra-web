import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import IconifyIcon from 'components/base/IconifyIcon';

const services = [
  {
    id: 1,
    label: 'Login & Security',
    icon: 'material-symbols:lock-outline',
    url: '#!',
  },
  {
    id: 2,
    label: 'Gift cards',
    icon: 'material-symbols:redeem-rounded',
    url: '#!',
  },
  {
    id: 3,
    label: 'My payments',
    icon: 'material-symbols:payments-outline-rounded',
    url: '#!',
  },
  {
    id: 4,
    label: 'Digital support',
    icon: 'material-symbols:support',
    url: '#!',
  },
  {
    id: 5,
    label: 'My messages',
    icon: 'material-symbols:chat-outline-rounded',
    url: '#!',
  },
  {
    id: 6,
    label: 'My lists',
    icon: 'material-symbols:list-rounded',
    url: '#!',
  },
  {
    id: 7,
    label: 'Customer service',
    icon: 'material-symbols:support-agent-rounded',
    url: '#!',
  },
];

const AccountAside = () => {
  return (
    <Paper background={1} sx={{ height: 1 }}>
      <Box
        sx={(theme) => ({
          position: 'sticky',
          top: theme.mixins.ecommerceTopbar,
          p: { xs: 3, md: 5 },
        })}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
          }}
        >
          My services
        </Typography>
        <nav aria-label="Services list">
          <Grid container component={List} columnSpacing={2} disablePadding>
            {services.map(({ id, label, icon, url }) => (
              <Grid
                key={id}
                component={ListItem}
                disableGutters
                size={{
                  xs: 12,
                  sm: 6,
                  md: 12,
                }}
                sx={{ py: 0.5 }}
              >
                <ListItemButton
                  href={url}
                  sx={{
                    p: 3,
                    gap: 2,
                    bgcolor: 'background.elevation2',
                    '&:hover': { bgcolor: 'background.elevation3' },
                  }}
                >
                  <ListItemIcon>
                    <IconifyIcon icon={icon} fontSize={24} color="primary.dark" />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ m: 0 }}
                    slotProps={{
                      primary: { variant: 'body1', fontWeight: 700, color: 'text.primary' },
                    }}
                    primary={label}
                  />
                </ListItemButton>
              </Grid>
            ))}
          </Grid>
        </nav>
      </Box>
    </Paper>
  );
};

export default AccountAside;
