import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { cssVarRgba } from 'lib/utils';
import IconifyIcon from 'components/base/IconifyIcon';

dayjs.extend(advancedFormat);

const Attachment = ({ data }) => {
  return (
    <Card sx={{ p: 2, mb: 1, outline: 'none', bgcolor: 'background.elevation1', borderRadius: 4 }}>
      <Stack sx={{ gap: 2, alignItems: { xs: 'flex-start', md: 'center' } }}>
        {data.image && (
          <CardMedia
            component="img"
            image={data.image}
            sx={{ height: 48, width: 48, borderRadius: 2 }}
          />
        )}

        {data.icon && (
          <Stack
            sx={(theme) => ({
              height: 48,
              width: 48,
              flexShrink: 0,
              borderRadius: 2,
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: cssVarRgba(theme.vars.palette.primary.mainChannel, 0.15),
            })}
          >
            <IconifyIcon icon={data.icon} sx={{ color: 'primary.main', fontSize: 24 }} />
          </Stack>
        )}

        <CardContent sx={{ p: 0 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {data.filename}
          </Typography>
          <Stack sx={{ mt: 0.5, gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2">
              Added by <Link href="#!">{data.addedBy}</Link>
            </Typography>
            <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
              <IconifyIcon
                icon="material-symbols:schedule-outline-rounded"
                sx={{ color: 'text.secondary', fontSize: 16 }}
              />
              <Typography variant="body2">{dayjs(data.time).format('Do MMM, h:mm A')}</Typography>
            </Stack>
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 0, ml: 'auto' }}>
          <Button shape="square" variant="text" size="small" color="neutral">
            <IconifyIcon
              icon="material-symbols:more-horiz"
              sx={{ color: 'text.primary', fontSize: 18 }}
            />
          </Button>
        </CardActions>
      </Stack>
    </Card>
  );
};

export default Attachment;
