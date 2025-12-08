import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { maskCardNumber } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const CreditCard = ({ card, handleOpenDialog }) => {
  const { cardName, icon, subscriptions, cardNumber, expireDate } = card;
  const { between } = useBreakpoints();
  const betweenMdXl = between('md', 'xl');

  return (
    <Paper
      variant="elevation"
      background={1}
      elevation={0}
      sx={{
        p: 3,
        border: '0 !important',
        display: 'flex',
        alignItems: { sm: 'flex-start' },
        gap: 2,
      }}
    >
      <Image src={icon} alt="" width={40} height={40} />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={3}
        sx={{ justifyContent: 'space-between', alignItems: 'flex-start', flexGrow: 1, minWidth: 0 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row', md: 'column', lg: 'row' }}
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {cardName}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 400, textWrap: 'nowrap', color: 'text.secondary' }}
            >
              {maskCardNumber(cardNumber)}
            </Typography>
          </Stack>
          <Stack direction="column" spacing={3}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Expires: {dayjs(expireDate).format('MM/YY')}
            </Typography>
            <Typography variant="caption">{subscriptions} Subscriptions</Typography>
          </Stack>
        </Box>
        <Stack
          spacing={0.5}
          sx={{ ml: { xs: '-10px', sm: 'auto' }, justifyContent: 'center', minWidth: 0 }}
        >
          <Button
            size="small"
            shape={betweenMdXl ? 'square' : undefined}
            onClick={() => handleOpenDialog(card)}
            sx={[{ textWrap: 'nowrap' }, !betweenMdXl && { minWidth: 0 }]}
          >
            {betweenMdXl ? (
              <IconifyIcon icon="material-symbols:edit-outline-rounded" sx={{ fontSize: 20 }} />
            ) : (
              `Edit info`
            )}
          </Button>
          <Button
            size="small"
            shape={betweenMdXl ? 'square' : undefined}
            color="error"
            sx={[{ textWrap: 'nowrap' }, !betweenMdXl && { minWidth: 0 }]}
          >
            {betweenMdXl ? (
              <IconifyIcon icon="material-symbols:delete-outline-rounded" sx={{ fontSize: 20 }} />
            ) : (
              `Remove card`
            )}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default CreditCard;
