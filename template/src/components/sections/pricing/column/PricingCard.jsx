import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText, { listItemTextClasses } from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useNumberFormat from 'hooks/useNumberFormat';
import { useThemeMode } from 'hooks/useThemeMode';
import IconifyIcon from 'components/base/IconifyIcon';

const PricingCard = ({ data, isYearly }) => {
  const { currencyFormat } = useNumberFormat();
  const { isDark } = useThemeMode();

  return (
    <Card
      sx={[
        {
          p: 5,
          width: 1,
          maxWidth: 374,
          outline: 'none',
          borderRadius: 6,
        },
        !!data.recommended && { bgcolor: 'background.elevation1' },
      ]}
    >
      <CardHeader
        title={
          <Chip label={data.label} variant="soft" color="warning" size="large" sx={{ width: 1 }} />
        }
        sx={[
          { p: 0, mb: 5 },
          !data.label && { visibility: 'hidden', display: { xs: 'none', lg: 'block' } },
        ]}
      />

      <CardMedia
        component="img"
        image={isDark ? data.image.dark : data.image.light}
        alt="card_image"
        sx={{
          mb: 4,
          mx: 'auto',
          width: 64,
          height: 64,
          objectFit: 'contain',
        }}
      />

      <CardContent sx={{ p: 0, mb: 4.5 }}>
        <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary', textAlign: 'center' }}>
          {data.columnTitle}
        </Typography>

        {!data.price ? (
          <Typography variant="h3" sx={{ mb: 6, textAlign: 'center' }}>
            Free
          </Typography>
        ) : (
          <Stack spacing={1} sx={{ mb: 6, alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h3">
              {isYearly ? currencyFormat(data.price.yearly) : currencyFormat(data.price.monthly)}
            </Typography>
            <Typography variant="caption">/ {isYearly ? 'year' : 'month'}</Typography>
          </Stack>
        )}

        <Stack sx={{ justifyContent: 'center' }}>
          <List disablePadding>
            {data.features.map((item) => (
              <ListItem key={item.title} disablePadding>
                <ListItemIcon>
                  <IconifyIcon
                    icon={
                      item.active
                        ? 'material-symbols:check-rounded'
                        : 'material-symbols:remove-rounded'
                    }
                    color={item.active ? 'success.main' : 'text.disabled'}
                    fontSize={16}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    color: item.active ? 'text.secondary' : 'text.disabled',
                    [`& .${listItemTextClasses.primary}`]: {
                      typography: 'body2',
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 0 }}>
        <Button variant={data.recommended ? 'contained' : 'soft'} fullWidth>
          {!data.price ? 'Start free trial' : 'Sign up'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default PricingCard;
