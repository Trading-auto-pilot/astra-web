import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useNumberFormat from 'hooks/useNumberFormat';
import IconifyIcon from 'components/base/IconifyIcon';

const getChipStyle = (value) => {
  if (value > 0) {
    return {
      icon: 'material-symbols:trending-up-rounded',
      color: 'success',
    };
  } else if (value < 0) {
    return {
      icon: 'material-symbols:trending-down-rounded',
      color: 'error',
    };
  } else {
    return {
      icon: 'material-symbols:trending-flat-rounded',
      color: 'neutral',
    };
  }
};

const HRMKPI = ({ kpi }) => {
  const { numberFormat } = useNumberFormat();
  const { value, subtitle, change } = kpi;
  const { icon, color } = getChipStyle(change.percentage);

  return (
    <Paper
      component={Stack}
      direction="column"
      sx={{ p: { xs: 3, md: 5 }, pt: { xs: 2, md: 4 }, height: 1 }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
        sx={{
          mb: { xs: 2, xl: 1 },
          gap: 1,
          alignItems: { xs: 'flex-start', sm: 'baseline', md: 'flex-start', xl: 'baseline' },
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          {typeof value === 'number' ? numberFormat(value) : value}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {subtitle}
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: 'column', sm: 'row', md: 'column', xl: 'row' }}
        sx={{ mt: 'auto', gap: 1, alignItems: { xs: 'flex-start' } }}
      >
        <Chip
          label={`${numberFormat(change.percentage, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}%`}
          color={color}
          icon={<IconifyIcon icon={icon} />}
          sx={{ flexDirection: 'row-reverse' }}
        />
        <Typography
          variant="subtitle2"
          sx={{ color: 'text.secondary' }}
        >{`Since ${change.since}`}</Typography>
      </Stack>
    </Paper>
  );
};

export default HRMKPI;
