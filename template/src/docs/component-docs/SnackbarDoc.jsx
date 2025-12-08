import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const simpleSnackbarCode = `const SimpleSnackbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <div>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton aria-label="close" color="inherit" onClick={handleClose}>
        <IconifyIcon icon="material-symbols-light:cancel-outline" />
      </IconButton>
    </div>
  );

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Button onClick={handleClick}>Open Snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Note archived"
        action={action}
      />
    </Stack>
  );
};
render(<SimpleSnackbar/>)
`.trim();

const positionSnackbarCode = `
const SnackbarPositioned = () => {
  const [state, setState] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, open } = state;

  const handleClick = (newState) => () => {
    setState({ open: true, ...newState });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      <Stack spacing={1} sx={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button variant="outlined" onClick={handleClick({ vertical: 'top', horizontal: 'center' })}>
          Top Center
        </Button>
        <Button variant="outlined" onClick={handleClick({ vertical: 'top', horizontal: 'right' })}>
          Top Right
        </Button>
        <Button
          variant="outlined"
          onClick={handleClick({ vertical: 'bottom', horizontal: 'right' })}
        >
          Bottom Right
        </Button>
        <Button
          variant="outlined"
          onClick={handleClick({ vertical: 'bottom', horizontal: 'center' })}
        >
          Bottom Center
        </Button>
        <Button
          variant="outlined"
          onClick={handleClick({ vertical: 'bottom', horizontal: 'left' })}
        >
          Bottom Left
        </Button>
        <Button variant="outlined" onClick={handleClick({ vertical: 'top', horizontal: 'left' })}>
          Top Left
        </Button>
      </Stack>
      <Snackbar
        open={open}
        onClose={handleClose}
        message="I love snacks"
        autoHideDuration={3000}
        key={vertical + horizontal}
        anchorOrigin={{ vertical, horizontal }}
      />
    </>
  );
};
render(<SnackbarPositioned/>)
`.trim();

const contentSnackbarCode = `
const action = (
  <Button color="secondary" size="small">
    lorem ipsum dolorem
  </Button>
);

const LongTextSnackbar = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Stack
        direction="column"
        spacing={2}
        sx={{ maxWidth: 600, width: 1, justifyContent: 'center', alignItems: 'stretch' }}
      >
        <SnackbarContent message="I love snacks." action={action} />
        <SnackbarContent
          message={
            'I love candy. I love cookies. I love cupcakes. ' +
            'I love cheesecake. I love chocolate.'
          }
        />
        <SnackbarContent
          message="I love candy. I love cookies. I love cupcakes."
          action={action}
        />
        <SnackbarContent
          message={
            'I love candy. I love cookies. I love cupcakes. ' +
            'I love cheesecake. I love chocolate.'
          }
          action={action}
        />
      </Stack>
    </Stack>
  );
};

render(<LongTextSnackbar />)
`.trim();

const dismissibleSnackbarCode = `
const AutohideSnackbar = () => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Button onClick={handleClick}>Open Snackbar</Button>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="This Snackbar will be dismissed in 5 seconds."
      />
    </Stack>
  );
};
render(<AutohideSnackbar/>)
`.trim();

const transitionSnackbarCode = `
const SlideTransition = (props) => {
  return <Slide {...props} direction="up" />;
};

const GrowTransition = (props) => {
  return <Grow {...props} />;
};

const TransitionsSnackbar = () => {
  const [state, setState] = useState({
    open: false,
    Transition: Fade,
  });

  const handleClick = (Transition) => () => {
    setState({
      open: true,
      Transition,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <Stack spacing={2} sx={{ justifyContent: 'center' }}>
      <Button onClick={handleClick(GrowTransition)}>Grow Transition</Button>
      <Button onClick={handleClick(Fade)}>Fade Transition</Button>
      <Button onClick={handleClick(SlideTransition)}>Slide Transition</Button>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        slots={{ transition: state.Transition }}
        message="I love snacks"
        key={state.Transition.name}
        autoHideDuration={1200}
      />
    </Stack>
  );
};

render(<TransitionsSnackbar />)
`.trim();

const alertSnackbarCode = `
const SnackbarAlert = () => {
  const [openPrimary, setOpenPrimary] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openWarning, setOpenWarning] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

  const handleClose = (setOpen) => (
    event,
    reason
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Stack spacing={1} sx={{ justifyContent: 'center', flexWrap: 'wrap' }}>
      <Button variant="outlined" color="primary" onClick={() => setOpenPrimary(true)}>
        Primary
      </Button>
      <Button variant="outlined" color="success" onClick={() => setOpenSuccess(true)}>
        Success
      </Button>
      <Button variant="outlined" color="warning" onClick={() => setOpenWarning(true)}>
        Warning
      </Button>
      <Button variant="outlined" color="error" onClick={() => setOpenError(true)}>
        Error
      </Button>
      <Button variant="outlined" color="info" onClick={() => setOpenInfo(true)}>
        Info
      </Button>

      <Snackbar open={openPrimary} onClose={handleClose(setOpenPrimary)} autoHideDuration={3000}>
        <Alert variant="filled" severity="primary" onClose={handleClose(setOpenPrimary)}>
          This is a primary message!
        </Alert>
      </Snackbar>

      <Snackbar open={openSuccess} onClose={handleClose(setOpenSuccess)} autoHideDuration={3000}>
        <Alert variant="filled" severity="success" onClose={handleClose(setOpenSuccess)}>
          This is a success message!
        </Alert>
      </Snackbar>

      <Snackbar open={openWarning} onClose={handleClose(setOpenWarning)} autoHideDuration={3000}>
        <Alert variant="filled" severity="warning" onClose={handleClose(setOpenWarning)}>
          This is a warning message!
        </Alert>
      </Snackbar>

      <Snackbar open={openError} onClose={handleClose(setOpenError)} autoHideDuration={3000}>
        <Alert variant="filled" severity="error" onClose={handleClose(setOpenError)}>
          This is an error message!
        </Alert>
      </Snackbar>

      <Snackbar open={openInfo} onClose={handleClose(setOpenInfo)} autoHideDuration={3000}>
        <Alert variant="filled" severity="info" onClose={handleClose(setOpenInfo)}>
          This is an info message!
        </Alert>
      </Snackbar>
    </Stack>
  );
};
render(<SnackbarAlert/>)
`.trim();

const fabSnackbarCode = `
const FabIntegrationSnackbar = () => {
  const [open, setOpen] = useState(false);

  const handleToggleSnackbar = () => {
    setOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Box position="relative" sx={{ width: 1, maxWidth: 355 }}>
        <CssBaseline />
        <GlobalStyles
          styles={(theme) => ({
            body: { backgroundColor: theme.vars.palette.background.paper },
          })}
        />
        <Paper elevation={0} sx={{ height: 300 }}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <IconButton edge="start" sx={{ mr: 2 }} color="inherit" aria-label="menu">
                <IconifyIcon icon="material-symbols-light:menu" sx={{ fontSize: 28 }} />
              </IconButton>
              <Typography variant="h6" color="inherit" component="div">
                App bar
              </Typography>
            </Toolbar>
          </AppBar>
          <Fab
            color="secondary"
            sx={{
              position: 'absolute',
              bottom: (theme) => theme.spacing(2),
              right: (theme) => theme.spacing(2),
            }}
            onClick={handleToggleSnackbar}
          >
            <IconifyIcon icon="material-symbols-light:add" sx={{ fontSize: 28 }} />
          </Fab>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            message="Archived"
            action={
              <Button color="inherit" size="small" onClick={handleCloseSnackbar}>
                Undo
              </Button>
            }
            onClose={handleCloseSnackbar}
            sx={{ bottom: { xs: 90, sm: 5 } }}
          />
        </Paper>
      </Box>
    </Stack>
  );
};
render(<FabIntegrationSnackbar/>)
`.trim();

const consecutiveSnackbarCode = `
const ConsecutiveSnackbars = () => {
  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleClick = (message) => () => {
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <div>
      <Button onClick={handleClick('Message A')}>Show message A</Button>
      <Button onClick={handleClick('Message B')}>Show message B</Button>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={666000}
        onClose={handleClose}
        slotProps={{
          transition: {
            onExited: handleExited,
          },
        }}
        message={messageInfo ? messageInfo.message : undefined}
        action={
          <Box pt={0.5}>
            <Button color="secondary" size="small" onClick={handleClose}>
              UNDO
            </Button>
            <IconButton aria-label="close" color="inherit" onClick={handleClose}>
              <IconifyIcon icon="material-symbols-light:cancel-outline" />
            </IconButton>
          </Box>
        }
      />
    </div>
  );
};
render(<ConsecutiveSnackbars/>)
`.trim();

const SnackbarDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Snackbar',
        description:
          'Snackbars (also known as toasts) are used for brief notifications of processes that have been or will be performed.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Snackbar',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-snackbar`,
        folderLink: `${folderBaseLink}/SnackbarDoc.jsx`,
      }}
    >
      <DocSection title="Simple Snackbar">
        <DocCard code={simpleSnackbarCode} noInline />
      </DocSection>
      <DocSection
        title="Snackbar Position"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>anchorOrigin</Code>&nbsp; prop to control the Snackbar's position on
            the screen.
          </Typography>
        }
      >
        <DocCard code={positionSnackbarCode} noInline />
      </DocSection>
      <DocSection title="Snackbar Content">
        <DocCard code={contentSnackbarCode} noInline />
      </DocSection>
      <DocSection
        title="Transition"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can use the <Code>slots.transition</Code> prop to change the transition of the
            Snackbar from &nbsp;
            <Link
              href="https://mui.com/material-ui/transitions/#grow"
              target="_blank"
              rel="noopener nofollow"
            >
              Grow
            </Link>
            &nbsp; (the default) to others such as&nbsp;
            <Link
              href="https://mui.com/material-ui/transitions/#slide"
              target="_blank"
              rel="noopener nofollow"
            >
              Slide
            </Link>
            .
          </Typography>
        }
      >
        <DocCard code={transitionSnackbarCode} noInline />
      </DocSection>
      <DocSection
        title="Automatic Dismiss"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>autoHideDuration</Code>&nbsp; prop to automatically trigger the
            Snackbar's &nbsp;<Code>onClose</Code>&nbsp; function after a set period of time (in
            milliseconds).
          </Typography>
        }
      >
        <DocCard code={dismissibleSnackbarCode} noInline />
      </DocSection>
      <DocSection title="Use with Alerts">
        <DocCard code={alertSnackbarCode} noInline />
      </DocSection>
      <DocSection
        title="With Floating Action Button"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            If you're using a &nbsp;
            <Link
              href="https://mui.com/material-ui/react-floating-action-button/"
              target="_blank"
              rel="noopener nofollow"
            >
              Floating Action Button
            </Link>
            &nbsp; on mobile, Material Design recommends positioning snackbars directly above it, as
            shown in the demo below:
          </Typography>
        }
      >
        <DocCard code={fabSnackbarCode} noInline />
      </DocSection>
      <DocSection title="Consecutive Snackbars">
        <DocCard code={consecutiveSnackbarCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default SnackbarDoc;
