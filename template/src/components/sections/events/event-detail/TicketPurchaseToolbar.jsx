import { Button, Container, Paper, Stack, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const TicketPurchaseToolbar = ({ onPurchaseClick }) => {
  return (
    <Paper
      component={Stack}
      sx={({ mixins }) => ({
        position: 'sticky',
        zIndex: 999,
        width: 1,
        bottom: 0,
        bgcolor: 'background.menu',
        height: mixins.footer.sm,
      })}
    >
      <Container
        component={Stack}
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 5 },
          py: 1,
          maxWidth: 1280,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6">10$ - 200$</Typography>
        <Stack spacing={1}>
          <Button variant="soft" shape="square" color="neutral">
            <IconifyIcon icon="material-symbols:favorite-outline-rounded" width={20} height={20} />
          </Button>
          <Button variant="contained" onClick={onPurchaseClick}>
            Purchase
          </Button>
        </Stack>
      </Container>
    </Paper>
  );
};

export default TicketPurchaseToolbar;
