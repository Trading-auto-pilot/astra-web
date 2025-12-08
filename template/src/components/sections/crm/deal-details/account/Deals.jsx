import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip, { chipClasses } from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { currencyFormat } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';
import CRMDropdownMenu from '../../common/CRMDropdownMenu';

const Deals = ({ deals }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <Stack direction="column" gap={2}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        <Box component="span" sx={{ textTransform: 'capitalize' }}>
          {deals[0].state}
        </Box>{' '}
        Deals
      </Typography>
      <Stack direction="column" gap={1}>
        {deals.map((deal) => (
          <Stack
            key={deal.name}
            sx={{
              p: 3,
              bgcolor: 'background.elevation1',
              borderRadius: 2,
              gap: 2,
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Stack direction="column" gap={2}>
              <Typography
                variant="body1"
                component={Link}
                sx={[
                  { fontWeight: 700, width: 'max-content' },
                  deal.state === 'past' && { color: 'text.secondary' },
                ]}
              >
                {deal.name}
              </Typography>
              <Stack direction="column" gap={1}>
                <Stack gap={0.5} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    Budget:{' '}
                  </Typography>
                  <Typography sx={{ fontWeight: 500 }}>{currencyFormat(deal.budget)}</Typography>
                </Stack>
                {deal.state === 'ongoing' ? (
                  <Stack gap={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Closing Date:{' '}
                    </Typography>
                    <Typography sx={{ fontWeight: 500 }}>
                      {dayjs(deal.closingDate).format('D MMM, YYYY')}
                    </Typography>
                  </Stack>
                ) : (
                  <Stack gap={0.5} sx={{ alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Status:{' '}
                    </Typography>
                    <Chip
                      label={deal.status}
                      variant="soft"
                      color={deal.status === 'closed' ? 'success' : 'error'}
                      sx={{
                        [`& .${chipClasses.label}`]: {
                          textTransform: 'capitalize',
                        },
                      }}
                    />
                  </Stack>
                )}
              </Stack>
            </Stack>
            <Button shape="square" color="neutral" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <IconifyIcon icon="material-symbols:more-horiz" sx={{ fontSize: 20 }} />
            </Button>
            <CRMDropdownMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              handleClose={() => setAnchorEl(null)}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default Deals;
