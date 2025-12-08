import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicPopperCode = `const SimplePopper = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <Fragment>
      <Button variant="soft" aria-describedby={id} onClick={handleClick}>
        Toggle Popper
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Paper sx={{ borderRadius: 2 }}>
          <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
        </Paper>
      </Popper>
    </Fragment>
  );
}
render(<SimplePopper />)`;

const transitionsPopperCode = `const TransitionsPopper = ()  =>{
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  return (
    <Fragment>
      <Button variant="soft" aria-describedby={id} onClick={handleClick}>
        Toggle Popper
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ borderRadius: 2 }}>
              <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Fragment>
  );
}
render(<TransitionsPopper />)`;

const positionedPopperCode = `const PositionedPopper = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState();

  const handleClick = (newPlacement) => (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ borderRadius: 2 }}>
              <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid>
          <Button onClick={handleClick('top-start')}>top-start</Button>
          <Button onClick={handleClick('top')}>top</Button>
          <Button onClick={handleClick('top-end')}>top-end</Button>
        </Grid>
      </Grid>
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid size={6}>
          <Button onClick={handleClick('left-start')}>left-start</Button>
          <br />
          <Button onClick={handleClick('left')}>left</Button>
          <br />
          <Button onClick={handleClick('left-end')}>left-end</Button>
        </Grid>
        <Grid container size={6} direction="column" sx={{ alignItems: 'flex-end' }}>
          <Grid>
            <Button onClick={handleClick('right-start')}>right-start</Button>
          </Grid>
          <Grid>
            <Button onClick={handleClick('right')}>right</Button>
          </Grid>
          <Grid>
            <Button onClick={handleClick('right-end')}>right-end</Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid>
          <Button onClick={handleClick('bottom-start')}>bottom-start</Button>
          <Button onClick={handleClick('bottom')}>bottom</Button>
          <Button onClick={handleClick('bottom-end')}>bottom-end</Button>
        </Grid>
      </Grid>
    </Box>
  );
}
render(<PositionedPopper />)`;

const virtualElementCode = `const VirtualElementPopper = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const previousAnchorElPosition = useRef(undefined);

  useEffect(() => {
    if (anchorEl) {
      if (typeof anchorEl === 'object') {
        previousAnchorElPosition.current = anchorEl.getBoundingClientRect();
      } else {
        previousAnchorElPosition.current = anchorEl().getBoundingClientRect();
      }
    }
  }, [anchorEl]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();

    // Resets when the selection has a length of 0
    if (!selection || selection.anchorOffset === selection.focusOffset) {
      handleClose();
      return;
    }

    const getBoundingClientRect = () => {
      if (selection.rangeCount === 0 && previousAnchorElPosition.current) {
        setOpen(false);
        return previousAnchorElPosition.current;
      }
      return selection.getRangeAt(0).getBoundingClientRect();
    };

    setOpen(true);

    setAnchorEl({ getBoundingClientRect });
  };

  const id = open ? 'virtual-element-popper' : undefined;

  return (
    <div onMouseLeave={handleClose}>
      <Typography aria-describedby={id} onMouseUp={handleMouseUp}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus,
        bibendum sit amet vulputate eget, porta semper ligula. Donec bibendum
        vulputate erat, ac fringilla mi finibus nec. Donec ac dolor sed dolor
        porttitor blandit vel vel purus. Fusce vel malesuada ligula. Nam quis
        vehicula ante, eu finibus est. Proin ullamcorper fermentum orci, quis finibus
        massa. Nunc lobortis, massa ut rutrum ultrices, metus metus finibus ex, sit
        amet facilisis neque enim sed neque. Quisque accumsan metus vel maximus
        consequat. Suspendisse lacinia tellus a libero volutpat maximus.
      </Typography>
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
        placement="bottom-start"
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ borderRadius: 2 }}>
              <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    </div>
  );
}
render(<VirtualElementPopper />)`;

const PopperDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Popper',
        description: 'A Popper can be used to display some content on top of another.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Popper',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-popper`,
        folderLink: `${folderBaseLink}/PopperDoc.jsx`,
      }}
    >
      <DocSection title="Basic popper">
        <DocCard code={basicPopperCode} noInline />
      </DocSection>
      <DocSection
        title="Transitions"
        descriptionEl={
          <Typography
            component="div"
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The open/close state of the popper can be animated with a render prop child and a
            transition component. This component should respect the following conditions:
            <ul>
              <li>Be a direct child descendent of the popper.</li>
              <li>
                Call the <Code>onEnter</Code> callback prop when the enter transition starts.
              </li>
              <li>
                Call the <Code>onExited</Code> callback prop when the exit transition is completed.
                These two callbacks allow the popper to unmount the child content when closed and
                fully transitioned.
              </li>
            </ul>
          </Typography>
        }
      >
        <DocCard code={transitionsPopperCode} noInline />
      </DocSection>
      <DocSection title="Positioned popper">
        <DocCard code={positionedPopperCode} noInline />
      </DocSection>
      <DocSection
        title="Virtual element"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The value of the <Code>anchorEl</Code> prop can be a reference to a fake DOM element.
              You need to create an object shaped like the{' '}
              <Link href="https://popper.js.org/docs/v2/virtual-elements">
                <Code>VirtualElement</Code>
              </Link>
              .
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              Highlight part of the text to see the popper:
            </Typography>
          </>
        }
      >
        <DocCard code={virtualElementCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default PopperDoc;
