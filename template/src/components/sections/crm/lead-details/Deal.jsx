import { Button, Chip } from '@mui/material';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import useNumberFormat from 'hooks/useNumberFormat';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';

const Deal = ({ deal }) => {
  const { currencyFormat } = useNumberFormat();
  const { currentBreakpoint } = useBreakpoints();

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: deal.closingDate === 'closed' ? 'background.elevation2' : 'background.elevation1',
      }}
    >
      <Stack direction="column" gap={4}>
        <div>
          <Typography
            variant="body2"
            component={Link}
            href={paths.dealDetails}
            sx={{ fontWeight: 700 }}
          >
            {deal.name}
          </Typography>
          <Stack
            gap={1}
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              mt: 0.25,
            }}
          >
            <Typography variant="body2">
              <Box component="span" sx={{ fontWeight: 600 }}>
                Budget:
              </Box>{' '}
              {currencyFormat(deal.budget, {
                style: 'currency',
                maximumFractionDigits: 0,
                useGrouping: true,
              })}
            </Typography>
            <Typography component={Stack} variant="body2" gap={0.5} sx={{ alignItems: 'center' }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                Closing Date:
              </Box>{' '}
              {deal.closingDate === 'closed' ? (
                <Chip label="Closed" color="neutral" variant="soft" />
              ) : (
                dayjs(deal.closingDate).format('DD MMM, YYYY')
              )}
            </Typography>
          </Stack>
        </div>
        <ButtonGroup
          orientation={
            currentBreakpoint === 'xs' || currentBreakpoint === 'lg' ? 'vertical' : 'horizontal'
          }
          sx={{ gap: 0.25 }}
        >
          {deal.phases.map((phase) => (
            <Button
              key={phase.name}
              href={paths.deals}
              size="small"
              variant="soft"
              color={
                phase.status === 'done'
                  ? 'success'
                  : phase.status === 'ongoing'
                    ? 'primary'
                    : 'neutral'
              }
              fullWidth
              endIcon={
                phase.status === 'done' && (
                  <IconifyIcon icon="material-symbols:check-circle-outline-rounded" />
                )
              }
              sx={{ height: 46 }}
            >
              {phase.name}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
    </Box>
  );
};

export default Deal;
