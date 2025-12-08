import { memo } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  IconButton,
  LinearProgress,
  Link,
  Stack,
  Tooltip,
  Typography,
  avatarClasses,
} from '@mui/material';
import dayjs from 'dayjs';
import useNumberFormat from 'hooks/useNumberFormat';
import { useDealsContext } from 'providers/DealsProvider';
import { TOGGLE_DEAL_EXPAND } from 'reducers/DealsReducer';
import paths from 'routes/paths';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';

const contactLinks = [
  {
    id: 1,
    icon: 'material-symbols:call-outline',
    href: '#!',
  },
  {
    id: 2,
    icon: 'material-symbols:mail-outline-rounded',
    href: '#!',
  },
  {
    id: 3,
    icon: 'material-symbols:video-call-outline-rounded',
    href: '#!',
  },
  {
    id: 4,
    icon: 'material-symbols:contact-mail-outline-rounded',
    href: '#!',
  },
];

const DealCard = memo(({ deal }) => {
  const { dealsDispatch } = useDealsContext();
  const { currencyFormat } = useNumberFormat();

  const handleExpandClick = () => {
    dealsDispatch({ type: TOGGLE_DEAL_EXPAND, payload: { id: deal.id } });
  };

  return (
    <Card sx={{ borderRadius: 4, bgcolor: 'background.elevation1', outline: 'none' }}>
      <CardHeader
        avatar={<Image src={deal.company.logo} sx={{ height: 48, width: 48, borderRadius: 2 }} />}
        title={
          <Typography
            variant="subtitle2"
            component={Link}
            href={paths.dealDetails}
            underline="none"
            sx={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: { xs: 190, sm: 280 },
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            {deal.name}
          </Typography>
        }
        subheader={
          <Typography variant="body2" component={Link} href={deal.company.link}>
            {deal.company.name}
          </Typography>
        }
        action={
          <IconButton onClick={handleExpandClick}>
            <IconifyIcon
              icon="material-symbols:stat-minus-1-rounded"
              sx={(theme) => ({
                color: 'text.primary',
                transform: deal.expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest,
                }),
              })}
            />
          </IconButton>
        }
        sx={{ p: 3 }}
      />
      {!deal.expanded && (
        <CardContent sx={{ p: 3, pt: 0 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Budget:{' '}
            <Typography variant="body2" component="strong" sx={{ fontWeight: 600 }}>
              {currencyFormat(deal.amount, { minimumFractionDigits: 0 })}
            </Typography>
          </Typography>

          <Stack sx={{ mb: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <AvatarGroup
              max={5}
              sx={{
                mr: 1,
                display: 'inline-flex',
                [`& .${avatarClasses.root}`]: {
                  width: 32,
                  height: 32,
                  fontSize: 'caption.fontSize',
                  fontWeight: 'medium',
                  bgcolor: 'primary.main',
                },
              }}
            >
              {deal.collaborators?.map((user) => (
                <Tooltip key={user.id} title={user.name}>
                  <Avatar alt={user.name} src={user.avatar} />
                </Tooltip>
              ))}
            </AvatarGroup>

            <Chip
              icon={<IconifyIcon icon="material-symbols:timer-outline-rounded" />}
              label={dayjs(deal.closeDate).format('DD.MM.YY')}
              color="info"
            />
          </Stack>

          <LinearProgress
            variant="determinate"
            color={deal.progress === 100 ? 'success' : 'primary'}
            value={deal.progress}
          />
        </CardContent>
      )}
      <Collapse in={deal.expanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ p: 3, pt: 0 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Budget:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {currencyFormat(deal.amount, { minimumFractionDigits: 0 })}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Last update:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {dayjs(deal.lastUpdate).format('DD MMM, YYYY')}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Stage:
            </Typography>
            <Stack>
              <Chip label={deal.stage} color="warning" />
            </Stack>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Contact:
            </Typography>
            <Stack sx={{ gap: 0.5, alignItems: 'center' }}>
              <Typography
                component={Link}
                variant="body2"
                sx={{ alignItems: 'center', fontWeight: 600, mr: 1.5 }}
              >
                {deal.client.name}
              </Typography>

              {contactLinks.map((item) => (
                <Button
                  key={item.id}
                  variant="soft"
                  shape="square"
                  color="neutral"
                  size="small"
                  sx={{ fontSize: 18 }}
                >
                  <IconifyIcon icon={item.icon} />
                </Button>
              ))}
            </Stack>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Agents:
            </Typography>

            {deal.collaborators?.map((user) => (
              <Chip
                key={user.id}
                avatar={
                  <Avatar
                    alt={user.name}
                    src={user.avatar}
                    sx={{ border: (theme) => `1px solid ${theme.vars.palette.background.default}` }}
                  />
                }
                label={user.name.replace(/(\w)\w+$/, '$1.')}
                color="neutral"
                sx={{ mr: 0.75 }}
              />
            ))}

            <Button
              variant="text"
              shape="square"
              color="primary"
              size="small"
              sx={{ fontSize: 18 }}
            >
              <IconifyIcon icon="material-symbols:person-add-outline" />
            </Button>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Closing:
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {dayjs(deal.closeDate).format('DD MMM, YYYY')}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            color={deal.progress === 100 ? 'success' : 'primary'}
            value={deal.progress}
          />
        </CardContent>
      </Collapse>
    </Card>
  );
});

export default DealCard;
