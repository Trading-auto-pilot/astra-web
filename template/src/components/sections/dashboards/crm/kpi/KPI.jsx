import { Paper, Stack, Typography } from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';

const KPI = ({ title, subtitle, value, icon }) => {
  const { numberFormat } = useNumberFormat();

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
      }}
    >
      <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      <Stack
        sx={{
          gap: 1,
          flexDirection: { xs: 'column', md: 'row', lg: 'column' },
          justifyContent: 'space-between',
        }}
      >
        <IconifyIcon
          icon={icon.name}
          sx={{
            flexShrink: 0,
            order: { md: 1, lg: 0 },
            fontSize: 48,
            color: icon.color,
          }}
        />
        <div>
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.5 }}>
            {typeof value === 'number' ? numberFormat(value) : value}
          </Typography>
          <Typography variant="body2" noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </div>
      </Stack>
    </Paper>
  );
};

export default KPI;
