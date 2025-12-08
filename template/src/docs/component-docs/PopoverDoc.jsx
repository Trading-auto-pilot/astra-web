import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicPopoverCode = `const BasicPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Fragment>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </Fragment>
  );
}
render(<BasicPopover />)`;

const mouseOverPopoverCode = `const MouseOverPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        Hover with a Popover.
      </Typography>
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>I use Popover.</Typography>
      </Popover>
    </div>
  );
}
render(<MouseOverPopover />)`;

const popsitionedPopoverCode = `const PopsitionedPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Fragment>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}>
        Open Popover
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
      </Popover>
    </Fragment>
  );
}
render(<PopsitionedPopover />)`;

const virtualElementCode = `const VirtualElementPopover = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setOpen(false);
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();

    // Skip if selection has a length of 0
    if (!selection || selection.anchorOffset === selection.focusOffset) {
      return;
    }

    const getBoundingClientRect = () => {
      return selection.getRangeAt(0).getBoundingClientRect();
    };

    setOpen(true);

    setAnchorEl({ getBoundingClientRect, nodeType: 1 });
  };

  const id = open ? 'virtual-element-popover' : undefined;

  return (
    <div>
      <Typography aria-describedby={id} onMouseUp={handleMouseUp}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ipsum purus,
        bibendum sit amet vulputate eget, porta semper ligula. Donec bibendum
        vulputate erat, ac fringilla mi finibus nec. Donec ac dolor sed dolor
        porttitor blandit vel vel purus. Fusce vel malesuada ligula. Nam quis
        vehicula ante, eu finibus est.
      </Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={handleClose}
        disableAutoFocus
      >
        <Paper>
          <Typography sx={{ p: 2 }}>The content of the Popover.</Typography>
        </Paper>
      </Popover>
    </div>
  );
}
render(<VirtualElementPopover />)`;

const PopoverDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Popover',
        description: 'A Popover can be used to display some content on top of another.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Popover',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-popover`,
        folderLink: `${folderBaseLink}/PopoverDoc.jsx`,
      }}
    >
      <DocSection title="Basic popover">
        <DocCard code={basicPopoverCode} noInline />
      </DocSection>
      <DocSection
        title="Mouse over interaction"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            This demo demonstrates how to use the <Code>Popover</Code> component and the mouseover
            event to achieve popover behavior.
          </Typography>
        }
      >
        <DocCard code={mouseOverPopoverCode} noInline />
      </DocSection>
      <DocSection
        title="Positioned popover"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can use the positioning props (<Code>anchorOrigin</Code> and{' '}
            <Code>transformOrigin</Code>) to position the popover element.
          </Typography>
        }
      >
        <DocCard code={popsitionedPopoverCode} noInline />
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
              <Link>
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
              Highlight part of the text to see the popover:
            </Typography>
          </>
        }
      >
        <DocCard code={virtualElementCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default PopoverDoc;
