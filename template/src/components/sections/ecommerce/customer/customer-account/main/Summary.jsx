import { useMemo } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const Summary = ({ stats }) => {
  const listItems = useMemo(() => {
    return [
      {
        id: 1,
        label: 'Wishlist',
        icon: 'material-symbols:favorite-outline-rounded',
        url: '#!',
        value: stats.wishlist,
      },
      {
        id: 2,
        label: 'Favourites',
        icon: 'material-symbols:store-outline-rounded',
        url: '#!',
        value: stats.favourites,
      },
      {
        id: 3,
        label: 'Vouchers',
        icon: 'material-symbols:sell-outline',
        url: '#!',
        value: stats.vouchers,
      },
    ];
  }, [stats]);

  return (
    <Paper sx={{ p: { xs: 3, md: 5 }, height: 1 }}>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
        }}
      >
        Summary
      </Typography>
      <List
        disablePadding
        sx={{
          display: 'flex',
          columnGap: 1,
          flexDirection: { xs: 'column', sm: 'row', xl: 'column' },
        }}
      >
        {listItems.map(({ id, label, icon, url, value }) => (
          <ListItem key={id} disableGutters sx={{ py: 0.5 }}>
            <ListItemButton
              href={url}
              sx={{
                px: 3,
                py: 2.5,
                gap: 2,
                borderRadius: 6,
                bgcolor: 'background.elevation1',
                '&:hover': { bgcolor: 'background.elevation2' },
                justifyContent: 'space-between',
                alignItems: { xs: 'center', sm: 'flex-start', xl: 'center' },
              }}
            >
              <Stack
                direction={{ xs: 'row', sm: 'column', xl: 'row' }}
                sx={{
                  rowGap: 1,
                  columnGap: 2,
                  alignItems: { xs: 'center', sm: 'flex-start', xl: 'center' },
                }}
              >
                <ListItemIcon
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: 'primary.lighter',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <IconifyIcon icon={icon} fontSize={24} color="primary.dark" />
                </ListItemIcon>
                <ListItemText
                  sx={{ m: 0 }}
                  slotProps={{
                    primary: { variant: 'body1', fontWeight: 700, color: 'text.primary' },
                  }}
                  primary={label}
                />
              </Stack>
              <ListItemText
                sx={{ flexGrow: 0 }}
                slotProps={{
                  primary: { variant: 'h5', color: 'primary.main' },
                }}
                primary={value}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Summary;
