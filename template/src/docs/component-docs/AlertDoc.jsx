import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const simpleAlertCode = `
<Stack spacing={1.5} direction="column">
  <Alert
    color="success"
    icon={<IconifyIcon icon="material-symbols-light:shield-question" />}
    sx={{ fontSize: 24 }}
  >
    Success Text
  </Alert>
  <Alert
    color="primary"
    icon={<IconifyIcon icon="material-symbols-light:database" />}
    sx={{ fontSize: 24 }}
  >
    Primary Text
  </Alert>
  <Alert
    color="neutral"
    icon={<IconifyIcon icon="material-symbols-light:check-circle" />}
    sx={{ fontSize: 24 }}
  >
    Neutral Text
  </Alert>
  <Alert
    color="warning"
    icon={<IconifyIcon icon="material-symbols-light:warning" />}
    sx={{ fontSize: 24 }}
  >
    Warning Text
  </Alert>
  <Alert
    color="info"
    icon={<IconifyIcon icon="material-symbols:info" />}
    sx={{ fontSize: 24 }}
  >
    Info Text
  </Alert>
  <Alert
    color="error"
    icon={<IconifyIcon icon="material-symbols-light:bug-report" />}
    sx={{ fontSize: 24 }}
  >
    Error Text
  </Alert>
</Stack>`.trim();

const severityAlertCode = `
<Stack spacing={1.5} direction="column">
  <Alert severity="success">This is a success Alert.</Alert>
  <Alert severity="neutral">This is a neutral Alert.</Alert>
  <Alert severity="primary">This is a primary Alert.</Alert>
  <Alert severity="info">This is an info Alert.</Alert>
  <Alert severity="warning">This is a warning Alert.</Alert>
  <Alert severity="error">This is an error Alert.</Alert>
</Stack>`.trim();

const variantsAlertCode = `
  <Stack spacing={1.5} direction="column">
    <Alert variant='standard' severity='success'>
      This is a standard success Alert
    </Alert>
    <Alert variant='standard' severity='info'>
      This is a standard info Alert
    </Alert>
    <Alert variant='filled' severity='success'>
      This is a filled success Alert
    </Alert>
    <Alert variant='filled' severity='info'>
      This is a filled info Alert
    </Alert>
    <Alert variant='outlined' severity='success'>
      This is an outlined success Alert
    </Alert>
    <Alert variant='outlined' severity='info'>
      This is an outlined info Alert
    </Alert>
  </Stack>
`.trim();

const alertTitleCode = `
<Stack spacing={2} direction="column">
  <Alert
    icon={<IconifyIcon icon="material-symbols:check-circle-rounded" sx={{ fontSize: 24 }} />}
    severity="success"
  >
    <AlertTitle>Success</AlertTitle>
    Operation successful — <strong>everything is up to date!</strong>
  </Alert>
  <Alert
    icon={<IconifyIcon icon="material-symbols:error-rounded" sx={{ fontSize: 24 }} />}
    severity="error"
  >
    <AlertTitle>Error</AlertTitle>
    Something went wrong — <strong>please try again later.</strong>
  </Alert>
  <Alert
    icon={<IconifyIcon icon="material-symbols:warning-rounded" sx={{ fontSize: 24 }} />}
    severity="warning"
  >
    <AlertTitle>Warning</AlertTitle>
    Please be cautious — <strong>review your actions.</strong>
  </Alert>
  <Alert
    icon={<IconifyIcon icon="material-symbols:info-rounded" sx={{ fontSize: 24 }} />}
    severity="info"
  >
    <AlertTitle>Info</AlertTitle>
    Note the following — <strong>changes have been saved.</strong>
  </Alert>
</Stack>
`.trim();

const transitionAlertCode = `
const TransitionAlerts = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ width: 1 }}>
      <Collapse in={open}>
        <Alert
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpen(false);
              }}
            >
              <IconifyIcon icon="material-symbols-light:cancel-outline" sx={{ fontSize: 24 }} />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          Click the close icon to see the Collapse transition in action!
        </Alert>
      </Collapse>
      <Button
        disabled={open}
        variant="outlined"
        onClick={() => {
          setOpen(true);
        }}
      >
        Re-open
      </Button>
    </Box>
  );
};
render(<TransitionAlerts/>)
`.trim();

const actionAlertCode = `
<Stack spacing={1.5} direction="column">
  <Alert
    onClose={(e) => {
      e.preventDefault();
    }}
    severity="warning"
  >
    This is a generic alert — <strong>please take note.</strong>
  </Alert>
  <Alert
    action={
      <Button color="success" variant="contained" size="small">
        Continue
      </Button>
    }
    variant="outlined"
  >
    This is an outlined alert with an action — <strong>you can continue.</strong>
  </Alert>
  <Alert
    action={
      <Button color="inherit" size="small">
        Undo
      </Button>
    }
    variant="filled"
  >
    This is a filled alert with an action — <strong>undo the last operation.</strong>
  </Alert>
</Stack>
`.trim();

const AlertDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Alert',
        description:
          'Alerts display brief messages for the user without interrupting their use of the app.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Alert',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-alert`,
        folderLink: `${folderBaseLink}/AlertDoc.jsx`,
      }}
    >
      <DocSection
        title="Simple Alert"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              lineHeight: 2,
            }}
          >
            The Alert component supports custom colors, for example &nbsp;
            <Code>success</Code> (default), &nbsp;
            <Code>primary</Code>, &nbsp;<Code>neutral</Code>, &nbsp;<Code>warning</Code>, &nbsp;
            <Code>info</Code>, &nbsp;<Code>error</Code>&nbsp; and icons via the &nbsp;
            <Code>icon</Code>&nbsp; prop for personalized feedback.
          </Typography>
        }
      >
        <DocCard code={simpleAlertCode} />
      </DocSection>
      <DocSection
        title="Severity"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
              lineHeight: 2,
            }}
          >
            The &nbsp;<Code>severity</Code>&nbsp;prop accepts six values representing different
            states— <Code>success</Code> (default), &nbsp;<Code>primary</Code>&nbsp;, &nbsp;
            <Code>neutral</Code>&nbsp;, &nbsp;<Code>info</Code>&nbsp;, &nbsp;<Code>warning</Code>
            &nbsp; and &nbsp;<Code>error</Code>
            &nbsp;–with corresponding icon and color combinations for each.
          </Typography>
        }
      >
        <DocCard code={severityAlertCode} />
      </DocSection>
      <DocSection
        title="Variants"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The Alert component comes with three alternative style &nbsp;options—
            <Code>standard</Code> (default), <Code>filled</Code>
            &nbsp; and &nbsp;<Code>outlined</Code>&nbsp; —which you can set using the &nbsp;
            <Code>variant</Code>&nbsp; prop.
          </Typography>
        }
      >
        <DocCard code={variantsAlertCode} />
      </DocSection>
      <DocSection
        title="Alert Title"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            To add a title to an Alert, import the &nbsp;
            <Code>AlertTitle</Code>&nbsp; component.
          </Typography>
        }
      >
        <DocCard code={alertTitleCode} />
      </DocSection>
      <DocSection
        title="Dismissible Alert"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You need to use one of the{' '}
            <Link href="https://mui.com/material-ui/transitions/" target="_blank">
              Transition components &nbsp;
            </Link>
            ( ex. <Code>Collapse</Code>, <Code>Fade</Code>, <Code>Grow</Code> and <Code>Slide</Code>{' '}
            ) to make a dismissible alert.
          </Typography>
        }
      >
        <DocCard code={transitionAlertCode} noInline />
      </DocSection>
      <DocSection title="Alert Actions">
        <DocCard code={actionAlertCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default AlertDoc;
