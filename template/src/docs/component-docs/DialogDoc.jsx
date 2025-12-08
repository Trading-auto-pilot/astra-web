import { Link, Unstable_TrapFocus as TrapFocus, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { blue } from 'theme/palette/colors';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const simpleDialogCode = `const emails = ['username@gmail.com', 'user02@gmail.com'];

const SimpleDialog = (props) => {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {emails.map((email) => (
          <ListItem disableGutters key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <IconifyIcon icon="material-symbols:person" sx={{ fontSize: 24 }} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick('addAccount')}
          >
            <ListItemAvatar>
              <Avatar>
                <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 24 }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Add account" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

const SimpleDialogDemo = () => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(emails[1]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Typography variant="subtitle1" component="div">
        Selected: {selectedValue}
      </Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        Open simple dialog
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}
render(<SimpleDialogDemo />);`;

const alertsCode = `const AlertDialog = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
render(<AlertDialog />);`;

const transitionsCode = `const Transition = ({ref, ...props}) => {
  return <Slide direction="up" ref={ref} {...props} />;
};

const AlertDialogSlide = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button>
      <Dialog
        open={open}
        slots={{ transition: Transition }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Use Google's location service?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose}>Agree</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
render(<AlertDialogSlide />)`;

const formDialogsCode = `const FormDialog = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            component: 'form',
            onSubmit: (event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const formJson = Object.fromEntries(formData.entries());
              const email = formJson.email;
              console.log(email);
              handleClose();
            },
          },
        }}
      >
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
render(<FormDialog />);`;

const fullScreenDialogsCode = `const Transition = ({ref, ...props}) => {
  return <Slide direction="up" ref={ref} {...props} />;
};

const FullScreenDialog = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open full-screen dialog
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{ transition: Transition }}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <IconifyIcon icon="material-symbols:close" sx={{ fontSize: 24 }} />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Sound
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>
        <List>
          <ListItemButton>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItemButton>
        </List>
      </Dialog>
    </Fragment>
  );
}
render(<FullScreenDialog />)`;

const optionalSizesCode = `const MaxWidthDialog = () => {
  const [open, setOpen] = useState(false);
  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('sm');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open max-width dialog
      </Button>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Optional sizes</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText>
          <Stack
            direction="column"
            noValidate
            component="form"
            sx={{
              m: 'auto',
              width: 'fit-content',
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">maxWidth</InputLabel>
              <Select
                autoFocus
                value={maxWidth}
                onChange={handleMaxWidthChange}
                label="maxWidth"
                inputProps={{
                  name: 'max-width',
                  id: 'max-width',
                }}
              >
                <MenuItem value={false}>false</MenuItem>
                <MenuItem value="xs">xs</MenuItem>
                <MenuItem value="sm">sm</MenuItem>
                <MenuItem value="md">md</MenuItem>
                <MenuItem value="lg">lg</MenuItem>
                <MenuItem value="xl">xl</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              sx={{ mt: 1, mx: 0 }}
              control={
                <Switch checked={fullWidth} onChange={handleFullWidthChange} sx={{ mr: 1 }} />
              }
              label="Full width"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
render(<MaxWidthDialog />)`;

const responsiveFullScreenDialogCode = `const ResponsiveDialog = () => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open responsive dialog
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Disagree
          </Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
render(<ResponsiveDialog />)`;

const confirmationDialogCode = `const options = [
  'None',
  'Atria',
  'Callisto',
  'Dione',
  'Ganymede',
  'Hangouts Call',
  'Luna',
  'Oberon',
  'Phobos',
  'Pyxis',
  'Sedna',
  'Titania',
  'Triton',
  'Umbriel',
];

const ConfirmationDialogRaw = (props) => {
  const { onClose, value: valueProp, open, ...other } = props;
  const [value, setValue] = useState(valueProp);
  const radioGroupRef = useRef(null);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      sx={{ [\`& .\${dialogClasses.paper}\`]: { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      slotProps={{
        transition: {
          onEntering: handleEntering,
        },
      }}
      open={open}
      {...other}
    >
      <DialogTitle>Phone Ringtone</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>OK</Button>
      </DialogActions>
    </Dialog>
  );
}

const ConfirmationDialog = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('Dione');

  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <List component="div" role="group">
        <ListItemButton divider disabled>
          <ListItemText primary="Interruptions" />
        </ListItemButton>
        <ListItemButton
          divider
          aria-haspopup="true"
          aria-controls="ringtone-menu"
          aria-label="phone ringtone"
          onClick={handleClickListItem}
        >
          <ListItemText primary="Phone ringtone" secondary={value} />
        </ListItemButton>
        <ListItemButton divider disabled>
          <ListItemText primary="Default notification ringtone" secondary="Tethys" />
        </ListItemButton>
        <ConfirmationDialogRaw
          id="ringtone-menu"
          keepMounted
          open={open}
          onClose={handleClose}
          value={value}
        />
      </List>
    </Box>
  );
}
render(<ConfirmationDialog />)`;

const nonModalDialogCode = `import { Unstable_TrapFocus as TrapFocus } from '@mui/material';

const CookiesBanner = () => {
  const [bannerOpen, setBannerOpen] = useState(true);

  const closeBanner = () => {
    setBannerOpen(false);
  };

  return (
    <Fragment>
      <CssBaseline />
      <AppBar position="static" component="nav">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu">
            <IconifyIcon icon="material-symbols:menu" sx={{ fontSize: 24 }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ pt: 3 }}>
        <Typography component="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet.
        </Typography>
        <Typography component="p">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
          enim praesent elementum facilisis leo vel. Risus at ultrices mi tempus
          imperdiet.
        </Typography>
      </Container>
      <TrapFocus open disableAutoFocus disableEnforceFocus>
        <Fade appear={false} in={bannerOpen}>
          <Paper
            role="dialog"
            aria-modal="false"
            aria-label="Cookie banner"
            square
            variant="outlined"
            tabIndex={-1}
            sx={{
              position: 'relative',
              bottom: -20,
              left: 0,
              right: 0,
              m: 0,
              p: 2,
              borderWidth: 0,
              borderTopWidth: 1,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row', md: 'column', lg: 'row' }}
              spacing={2}
              sx={{ justifyContent: 'space-between' }}
            >
              <Box
                sx={{
                  flexShrink: 1,
                  alignSelf: { xs: 'flex-start', sm: 'center' },
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>This website uses cookies</Typography>
                <Typography variant="body2">
                  example.com relies on cookies to improve your experience.
                </Typography>
              </Box>
              <Stack
                spacing={2}
                direction={{
                  xs: 'row-reverse',
                  sm: 'row',
                }}
                sx={{
                  flexShrink: 0,
                  alignSelf: { xs: 'flex-end', sm: 'center', md: 'flex-end', lg: 'center' },
                }}
              >
                <Button size="small" onClick={closeBanner} variant="contained">
                  Allow all
                </Button>
                <Button size="small" onClick={closeBanner}>
                  Reject all
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      </TrapFocus>
    </Fragment>
  );
}
render(<CookiesBanner />)`;

const scrollingLongContentCode = `const ScrollDialog = () => {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState('paper');

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Fragment>
      <Button onClick={handleClickOpen('paper')}>scroll=paper</Button>
      <Button onClick={handleClickOpen('body')}>scroll=body</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {[...new Array(50)]
              .map(
                () => \`Cras mattis consectetur purus sit amet fermentum.
                    Cras justo odio, dapibus ac facilisis in, egestas eget quam.
                    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
                    Praesent commodo cursus magna, vel scelerisque nisl consectetur et.\`,
              )
              .join('\\n')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
render(<ScrollDialog />)`;

const DialogDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Dialog',
        description:
          'Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Dialog',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-dialog`,
        folderLink: `${folderBaseLink}/DialogDoc.jsx`,
      }}
    >
      <DocSection title="Simple dialog">
        <DocCard code={simpleDialogCode} noInline scope={{ blue }} />
      </DocSection>
      <DocSection
        title="Alerts"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Alerts are urgent interruptions, requiring acknowledgement, that inform the user about a
            situation.
          </Typography>
        }
      >
        <DocCard code={alertsCode} noInline />
      </DocSection>
      <DocSection
        title="Transitions"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can also swap out the transition, the next example uses <Code>Slide</Code>.
          </Typography>
        }
      >
        <DocCard code={transitionsCode} noInline />
      </DocSection>
      <DocSection
        title="Form dialogs"
        description="Form dialogs allow users to fill out form fields within a dialog."
      >
        <DocCard code={formDialogsCode} noInline />
      </DocSection>
      <DocSection title="Full-screen dialogs">
        <DocCard code={fullScreenDialogsCode} noInline />
      </DocSection>
      <DocSection
        title="Optional sizes"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can set a dialog maximum width by using the <Code>maxWidth</Code> enumerable in
            combination with the <Code>fullWidth</Code> boolean. When the <Code>fullWidth</Code>{' '}
            prop is true, the dialog will adapt based on the <Code>maxWidth</Code> value.
          </Typography>
        }
      >
        <DocCard code={optionalSizesCode} noInline />
      </DocSection>
      <DocSection
        title="Responsive full-screen"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You may make a dialog responsively full screen using <Code>useMediaQuery</Code>.
          </Typography>
        }
      >
        <DocCard code={responsiveFullScreenDialogCode} noInline />
      </DocSection>
      <DocSection title="Confirmation dialogs">
        <DocCard code={confirmationDialogCode} noInline />
      </DocSection>
      <DocSection
        title="Non-modal dialog"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
              }}
            >
              Dialogs can also be non-modal, meaning they don't interrupt user interaction behind
              it. Visit{' '}
              <Link href="https://www.nngroup.com/articles/modal-nonmodal-dialog" target="_blank">
                the Nielsen Norman Group article
              </Link>{' '}
              for more in-depth guidance about modal vs. non-modal dialog usage.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              The demo below shows a persistent cookie banner, a common non-modal dialog use case.
            </Typography>
          </>
        }
      >
        <DocCard code={nonModalDialogCode} noInline scope={{ TrapFocus }} />
      </DocSection>
      {/* Draggable dialog missing due to react-draggable package not available */}
      <DocSection
        title="Scrolling long content"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 3,
              }}
            >
              When dialogs become too long for the user's viewport or device, they scroll.
            </Typography>
            <ul>
              <li>
                <Code>scroll=paper</Code> the content of the dialog scrolls within the paper
                element.
              </li>
              <li>
                <Code>scroll=body</Code> the content of the dialog scrolls within the body element.
              </li>
            </ul>
          </>
        }
      >
        <DocCard code={scrollingLongContentCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default DialogDoc;
