import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Typography,
  buttonClasses,
  chipClasses,
} from '@mui/material';
import useNumberFormat from 'hooks/useNumberFormat';
import { useThemeMode } from 'hooks/useThemeMode';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import IconifyIcon from 'components/base/IconifyIcon';

const PricingPlanCard = ({ tableTitle, price, image, recommended = false, isYearly, sx }) => {
  const { currencyFormat } = useNumberFormat();
  const { down } = useBreakpoints();
  const { isDark } = useThemeMode();

  const downSm = down('sm');
  const downMd = down('md');

  return (
    <Card
      sx={{
        bgcolor: 'background.elevation1',
        outline: 'none',
        p: { xs: 3, md: 5 },
        ...sx,
      }}
    >
      {recommended && !downSm && (
        <Chip
          label="Best Value"
          size={downMd ? 'small' : 'large'}
          color="warning"
          sx={{
            mb: 4,
            width: 1,
            [`& .${chipClasses.label}`]: { overflow: 'hidden' },
          }}
        />
      )}

      <CardMedia
        component="img"
        image={isDark ? image.dark : image.light}
        alt="card_image"
        sx={{
          mb: 4,
          mx: 'auto',
          width: { xs: 40, md: 64 },
          height: { xs: 40, md: 64 },
          objectFit: 'contain',
        }}
      />

      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 1, fontSize: { xs: 'subtitle2.fontSize', md: 'h6.fontSize' } }}
        >
          {tableTitle}
        </Typography>

        <Typography
          variant="h3"
          color="text.primary"
          align="center"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            whiteSpace: 'nowrap',
            fontSize: { xs: 'subtitle2.fontSize', md: 'h6.fontSize', xl: 'h3.fontSize' },
          }}
        >
          {price ? (
            <>{isYearly ? currencyFormat(price.yearly) : currencyFormat(price.monthly)}</>
          ) : (
            <Stack direction="column" gap={1}>
              Free
              <Typography
                component="span"
                variant="caption"
                sx={{ opacity: 0, display: { xs: 'inline', sm: 'none' } }}
              >
                / m
              </Typography>
            </Stack>
          )}
          {price && (
            <Typography component="span" variant="caption">
              / {isYearly ? 'y' : 'm'}
            </Typography>
          )}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Button
            size={downMd ? 'small' : 'medium'}
            variant={recommended ? 'contained' : 'soft'}
            startIcon={downMd ? <IconifyIcon icon="material-symbols:shopping-cart" /> : undefined}
            color="primary"
            fullWidth
            sx={{
              minWidth: { xs: 0, sm: 0 },
              [`& .${buttonClasses.startIcon}`]: { m: 0 },
            }}
          >
            {downMd ? '' : 'Sign up'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PricingPlanCard;
