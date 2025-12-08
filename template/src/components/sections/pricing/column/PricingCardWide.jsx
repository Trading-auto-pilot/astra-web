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

const PricingCardWide = ({ data, isYearly }) => {
  const { currencyFormat } = useNumberFormat();
  const { isDark } = useThemeMode();

  return (
    <Card
      sx={[
        {
          p: 5,
          width: 1,
          maxWidth: 600,
          outline: 'none',
          borderRadius: 6,
        },
        !!data.recommended && { bgcolor: 'background.elevation1' },
      ]}
    >
      <CardHeader
        title={
          <Chip label={data.label} variant="soft" color="warning" size="large" sx={{ ml: 11.5 }} />
        }
        sx={[{ p: 0, mb: 2 }, !data.label && { display: 'none' }]}
      />

      <Stack spacing={4} direction="row">
        <CardMedia
          component="img"
          image={isDark ? data.image.dark : data.image.light}
          height={64}
          alt="card_image"
          sx={{
            mb: 4,
            mx: 'auto',
            width: 64,
            objectFit: 'contain',
          }}
        />

        <CardContent sx={{ p: '0 !important', flexGrow: 1 }}>
          <Stack direction="row" sx={{ mb: 2, alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {data.columnTitle}
            </Typography>

            {!data.price ? (
              <Typography variant="h3" sx={{ ml: 2 }}>
                Free
              </Typography>
            ) : (
              <>
                <Typography variant="h3" sx={{ ml: 2 }}>
                  {isYearly
                    ? currencyFormat(data.price.yearly)
                    : currencyFormat(data.price.monthly)}
                </Typography>
                <Typography variant="caption" sx={{ ml: 1 }}>
                  / {isYearly ? 'year' : 'month'}
                </Typography>
              </>
            )}
          </Stack>

          <List
            sx={{
              mb: 3,
              columns: 2,
            }}
            disablePadding
          >
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

          <CardActions sx={{ p: 0 }}>
            <Button variant={data.recommended ? 'contained' : 'soft'} fullWidth>
              {!data.price ? 'Start free trial' : 'Sign up'}
            </Button>
          </CardActions>
        </CardContent>
      </Stack>
    </Card>
  );
};

export default PricingCardWide;
