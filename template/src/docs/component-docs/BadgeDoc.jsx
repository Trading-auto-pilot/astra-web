import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicBadgesCode = `<Stack spacing={2}>
  <Badge badgeContent={4} color="primary">
    <IconifyIcon icon="material-symbols:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }}/>
  </Badge>
  <Badge badgeContent={4} color="secondary">
    <IconifyIcon icon="material-symbols:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} color="success">
    <IconifyIcon icon="material-symbols:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} color="warning">
    <IconifyIcon icon="material-symbols:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} color="info">
    <IconifyIcon icon="material-symbols:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} color="error">
    <IconifyIcon icon="material-symbols:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
</Stack>`;

const badgeDotCode = `<Stack spacing={2}>
  <Badge badgeContent={4} variant="dot" color="primary">
    <IconifyIcon icon="material-symbols-light:mail-outline" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} variant="dot" color="secondary">
    <IconifyIcon icon="material-symbols-light:mail-outline" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} variant="dot" color="success">
    <IconifyIcon icon="material-symbols-light:mail-outline" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} variant="dot" color="warning">
    <IconifyIcon icon="material-symbols-light:mail-outline" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} variant="dot" color="info">
    <IconifyIcon icon="material-symbols-light:mail-outline" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={4} variant="dot" color="error">
    <IconifyIcon icon="material-symbols-light:mail-outline" sx={{ fontSize: 24 }} />
  </Badge>
</Stack>`;

const badgeMaxCode = `
<Stack spacing={4} sx={{ color: 'action.active' }}>
  <Badge color="secondary" badgeContent={99}>
    <IconifyIcon icon="material-symbols-light:mail-rounded" sx={{ fontSize: 25 }} />
  </Badge>
  <Badge color="secondary" badgeContent={100}>
    <IconifyIcon icon="material-symbols-light:mail-rounded" sx={{ fontSize: 25 }} />
  </Badge>
  <Badge color="secondary" badgeContent={1000} max={999}>
    <IconifyIcon icon="material-symbols-light:mail-rounded" sx={{ fontSize: 25 }} />
  </Badge>
</Stack>
`.trim();

const badgeOverlapCode = `<Stack spacing={2}>
  <Badge color="error" overlap="circular" variant="dot">
    <Avatar alt="Basic" variant="circular" sx={{ bgcolor: 'primary.main' }}>
      <IconifyIcon icon="material-symbols-light:account-circle-outline" sx={{ fontSize: 24 }} />
    </Avatar>
  </Badge>
  <Badge color="error" variant="dot">
    <Avatar alt="Basic" variant="rounded" sx={{ bgcolor: 'primary.main' }}>
      <IconifyIcon icon="material-symbols-light:account-circle-outline" sx={{ fontSize: 24 }} />
    </Avatar>
  </Badge>
  <Badge badgeContent=" " color="error" overlap="circular">
    <Avatar alt="Basic">U</Avatar>
  </Badge>
  <Badge badgeContent=" " color="error">
    <Avatar alt="Basic" variant="square">
      U
    </Avatar>
  </Badge>
</Stack>`;

const badgeVisibilityCode = `
const BadgeVisibility = () => {
  const [count, setCount] = useState(1);
  const [invisible, setInvisible] = useState(false);

  return (
    <Stack
      spacing={2}
      sx={{
        color: 'action.active',
        flexDirection: 'column',
      }}
    >
      {/* Badge with count */}
      <Stack spacing={3} sx={{ alignItems: 'center' }}>
        <Badge color="secondary" badgeContent={count}>
          <IconifyIcon icon="material-symbols-light:mail-rounded" sx={{ fontSize: 25 }} />
        </Badge>
        <ButtonGroup>
          <Button aria-label="reduce" size="small" onClick={() => setCount(Math.max(count - 1, 0))}>
            <IconifyIcon icon="material-symbols-light:remove" sx={{ fontSize: 20 }} />
          </Button>
          <Button aria-label="increase" size="small" onClick={() => setCount(count + 1)}>
            <IconifyIcon icon="material-symbols-light:add" sx={{ fontSize: 20 }} />
          </Button>
        </ButtonGroup>
      </Stack>

      {/* Badge with dot variant */}
      <Stack spacing={4} sx={{ alignItems: 'center' }}>
        <Badge color="secondary" variant="dot" invisible={invisible}>
          <IconifyIcon icon="material-symbols-light:mail-rounded" sx={{ fontSize: 25 }} />
        </Badge>
        <FormControlLabel
          sx={{ color: 'text.primary', gap: 1 }}
          control={<Switch checked={!invisible} onChange={() => setInvisible(!invisible)} />}
          label="Show Badge"
        />
      </Stack>
    </Stack>
  );
};
render(<BadgeVisibility />)
`.trim();

const badgeAlignmentCode = `<Stack spacing={3}>
  <Badge badgeContent={9} color="primary">
    <IconifyIcon icon="material-symbols-light:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge color="primary" variant="dot">
    <IconifyIcon icon="material-symbols-light:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={9} color="primary" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
    <IconifyIcon icon="material-symbols-light:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={9} color="primary" anchorOrigin={{ vertical: 'top', horizontal: 'left' }}>
    <IconifyIcon icon="material-symbols-light:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
  <Badge badgeContent={99} color="primary" anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
    <IconifyIcon icon="material-symbols-light:mail-rounded" color="text.secondary" sx={{ fontSize: 24 }} />
  </Badge>
</Stack>`;

const BadgeDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Badge',
        description: 'Badge generates a small badge to the top-right of its child(ren).',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Badge',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-badge`,
        folderLink: `${folderBaseLink}/BadgeDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Badge"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              lineHeight: 2,
            }}
          >
            The Badge component supports custom colors (&nbsp;<Code>primary</Code>&nbsp;, &nbsp;
            <Code>secondary</Code>&nbsp; , &nbsp;<Code>success</Code>&nbsp;, &nbsp;
            <Code>warning</Code>&nbsp;, &nbsp;<Code>info</Code>&nbsp;, &nbsp;<Code>error</Code>
            &nbsp;) and allows you to display a badge with content or icons for notifications and
            statuses.
          </Typography>
        }
      >
        <DocCard code={basicBadgesCode} />
      </DocSection>
      <DocSection
        title="Badge Dot"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Utilize &nbsp;<Code>variant='dot'</Code>&nbsp; prop to display small dot badges without
            numeric values.
          </Typography>
        }
      >
        <DocCard code={badgeDotCode} />
      </DocSection>
      <DocSection
        title="Badge Visibility"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The visibility of badges can be controlled using the &nbsp;<Code>invisible</Code>&nbsp;
            prop.
          </Typography>
        }
      >
        <DocCard code={badgeVisibilityCode} noInline />
      </DocSection>
      <DocSection
        title="Maximum Value"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can use the &nbsp;<Code>max</Code>&nbsp; prop to cap the value of the badge content.
          </Typography>
        }
      >
        <DocCard code={badgeMaxCode} />
      </DocSection>
      <DocSection
        title="Badge Overlap"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Utilize &nbsp;<Code>overlap</Code>&nbsp; prop to adjust the badge's position relative to
            its parent element.
          </Typography>
        }
      >
        <DocCard code={badgeOverlapCode} />
      </DocSection>
      <DocSection
        title="Badge Alignment"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use &nbsp;<Code>anchorOrigin</Code>&nbsp; prop to position badges at different corners
            of the parent element.
          </Typography>
        }
      >
        <DocCard code={badgeAlignmentCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default BadgeDoc;
