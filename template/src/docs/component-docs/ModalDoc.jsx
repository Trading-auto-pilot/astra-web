import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicModalCode = `const BasicModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: 300, sm: 400 },
            borderRadius: 4,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Paper>
      </Modal>
    </Stack>
  );
};
render(<BasicModal/>)
`.trim();

const nestedModalCode = `
const ChildModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button fullWidth variant="outlined" onClick={handleOpen}>Open Child Modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <Paper
          component={Stack}
          sx={{
            flexDirection: 'column',
            gap: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 4,
            pt: 2,
            px: 4,
            pb: 3,
            width: 240,
          }}
        >
          <Typography id="child-modal-title" variant="h6">
            Child modal
          </Typography>
          <Typography id="child-modal-description" variant="body1">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit.
          </Typography>
          <Button onClick={handleClose}>Close Child Modal</Button>
        </Paper>
      </Modal>
    </>
  );
};

const NestedModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Paper
          component={Stack}
          sx={{
            flexDirection: 'column',
            gap: 2,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 4,
            pt: 2,
            px: 4,
            pb: 3,
            width: { xs: 300, sm: 400 },
          }}
        >
          <Typography id="parent-modal-title" variant="h6">
            Text in a modal
          </Typography>
          <Typography id="parent-modal-description" variant="body1">
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          <ChildModal />
        </Paper>
      </Modal>
    </Stack>
  );
};
render(<NestedModal/>)
`.trim();

const transitionModalCode = `
const TransitionsModal = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: 300, sm: 400 },
            outline: 'none',
          }}
        >
          <Fade in={open} mountOnEnter unmountOnExit>
            <Paper
              sx={{
                width: { xs: 300, sm: 400 },
                borderRadius: 4,
                p: 4,
              }}
            >
              <Typography id="transition-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Paper>
          </Fade>
        </Box>
      </Modal>
    </Stack>
  );
};
render(<TransitionsModal/>)
`.trim();

const serverSideModalCode = `
const ServerModal = () => {
  const rootRef = useRef(null);

  return (
    <Box
      sx={{
        height: 300,
        flexGrow: 1,
        minWidth: { xs: 200, sm: 300 },
        transform: 'translateZ(0)',
        // The position fixed scoping doesn't work in IE11.
        // Disable this demo to preserve the others.
        '@media all and (-ms-high-contrast: none)': {
          display: 'none',
        },
      }}
      ref={rootRef}
    >
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open
        aria-labelledby="server-modal-title"
        aria-describedby="server-modal-description"
        sx={{
          display: 'flex',
          p: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        container={() => rootRef.current!}
      >
        <Paper
          variant="elevation"
          background={1}
          sx={{
            position: 'relative',
            width: 400,
            borderRadius: 4,
            p: { xs: 2, md: 4 },
          }}
        >
          <Typography id="server-modal-title" variant="h6">
            Server-side modal
          </Typography>
          <Typography id="server-modal-description" sx={{ pt: 2 }}>
            If you disable JavaScript, you will still see me.
          </Typography>
        </Paper>
      </Modal>
    </Box>
  );
};
render(<ServerModal/>)
`.trim();

const ModalDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Modal',
        description:
          'The modal component provides a solid foundation for creating dialogs, popovers, lightboxes, or whatever else.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Modal',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-modal`,
        folderLink: `${folderBaseLink}/ModalDoc.jsx`,
      }}
    >
      <DocSection title="Basic Modal">
        <DocCard code={basicModalCode} noInline />
      </DocSection>
      <DocSection title="Nested Modal">
        <DocCard code={nestedModalCode} noInline />
      </DocSection>
      <DocSection
        title="With Transition"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The open/close state of the modal can be animated with a &nbsp;
            <Link href="https://mui.com/material-ui/transitions/" target="_blank">
              Transition component &nbsp;
            </Link>
            ( ex. <Code>Fade</Code> ).
          </Typography>
        }
      >
        <DocCard code={transitionModalCode} noInline />
      </DocSection>
      <DocSection
        title="Server-Side Modal"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 6,
            }}
          >
            React doesn't support the &nbsp;<Code>createPortal()</Code>&nbsp; API on the server. In
            order to display the modal, you need to disable the portal feature with the &nbsp;
            <Code>disablePortal()</Code> &nbsp; prop:
          </Typography>
        }
      >
        <DocCard code={serverSideModalCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default ModalDoc;
