import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

const PricingHeader = ({ isYearly, handleSwitchChange, onButtonChange, displayMode }) => {
  const renderPricingSwitch = (
    <Stack spacing={1} sx={{ alignSelf: { xs: 'flex-start', lg: 'flex-end' } }}>
      <Typography variant="body1" color="text.secondary">
        Monthly pricing
      </Typography>
      <Switch checked={isYearly} onChange={handleSwitchChange} />
      <Typography variant="body1" color="text.secondary">
        Annual pricing
      </Typography>
    </Stack>
  );

  const renderPricingButtons = (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} sx={{ alignSelf: 'flex-end', width: 1 }}>
      <Button
        fullWidth
        variant="soft"
        size="large"
        color={isYearly ? 'primary' : 'neutral'}
        onClick={() => onButtonChange?.(true)}
      >
        Yearly
      </Button>{' '}
      <Button
        fullWidth
        variant="soft"
        size="large"
        color={!isYearly ? 'primary' : 'neutral'}
        onClick={() => onButtonChange?.(false)}
      >
        Monthly
      </Button>
    </Stack>
  );

  return (
    <Stack
      direction={{ xs: 'column', lg: displayMode === 'column' ? 'row' : 'column' }}
      sx={{
        px: { xs: 3, md: 5 },
        pt: { xs: 3, md: 5 },
        pb: 5,
        justifyContent: 'space-between',
        rowGap: { xs: 3, lg: 6 },
        columnGap: { xs: 3, lg: 0 },
      }}
    >
      <Box sx={{ maxWidth: 510 }}>
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ mb: 3, alignItems: { xs: 'flex-start', sm: 'center' } }}
        >
          <Typography variant="h4">Pricing Options</Typography>
          <Chip label="Free for 30 days" variant="soft" color="warning" />
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          Get the power, control, and customization you need to manage your team’s and
          organization’s projects.
        </Typography>

        <Link href="#!">Have questions? Chat with us</Link>
      </Box>

      {displayMode === 'column' ? renderPricingSwitch : renderPricingButtons}
    </Stack>
  );
};

export default PricingHeader;
