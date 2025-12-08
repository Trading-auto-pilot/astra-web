import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicTooltipCode = `<Tooltip title="Delete">
  <IconButton>
    <IconifyIcon icon='material-symbols:delete' sx={{ fontSize: 24 }} />
  </IconButton>
</Tooltip>`;

const positionedTooltipsCode = `<Box sx={{ mx: 'auto', width: 1, maxWidth: 450 }}>
  <Grid container sx={{ justifyContent: 'center' }}>
    <Grid>
      <Tooltip title="Add" placement="top-start">
        <Button>top-start</Button>
      </Tooltip>
      <Tooltip title="Add" placement="top">
        <Button>top</Button>
      </Tooltip>
      <Tooltip title="Add" placement="top-end">
        <Button>top-end</Button>
      </Tooltip>
    </Grid>
  </Grid>
  <Grid container sx={{ justifyContent: 'center' }}>
    <Grid size={6}>
      <Tooltip title="Add" placement="left-start">
        <Button>left-start</Button>
      </Tooltip>
      <br />
      <Tooltip title="Add" placement="left">
        <Button>left</Button>
      </Tooltip>
      <br />
      <Tooltip title="Add" placement="left-end">
        <Button>left-end</Button>
      </Tooltip>
    </Grid>
    <Grid container size={6} sx={{ alignItems: 'flex-end' }} direction="column">
      <Grid>
        <Tooltip title="Add" placement="right-start">
          <Button>right-start</Button>
        </Tooltip>
      </Grid>
      <Grid>
        <Tooltip title="Add" placement="right">
          <Button>right</Button>
        </Tooltip>
      </Grid>
      <Grid>
        <Tooltip title="Add" placement="right-end">
          <Button>right-end</Button>
        </Tooltip>
      </Grid>
    </Grid>
  </Grid>
  <Grid container sx={{ justifyContent: 'center' }}>
    <Grid>
      <Tooltip title="Add" placement="bottom-start">
        <Button>bottom-start</Button>
      </Tooltip>
      <Tooltip title="Add" placement="bottom">
        <Button>bottom</Button>
      </Tooltip>
      <Tooltip title="Add" placement="bottom-end">
        <Button>bottom-end</Button>
      </Tooltip>
    </Grid>
  </Grid>
</Box>`;

const arrowTooltipsCode = `<Stack spacing={1}>
  <Tooltip title="Add" arrow>
    <Button>Arrow</Button>
  </Tooltip>
  <Tooltip title="Add" arrow={false}>
    <Button>No Arrow</Button>
  </Tooltip>
</Stack>`;

const distanceFromAnchorOffsetCode = `<Tooltip
  title="Add"
  slotProps={{
    popper: {
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, -15],
          },
        },
      ],
    },
  }}
>
  <Button>Offset</Button>
</Tooltip>`;

const distanceFromAnchorMarginCode = `<Tooltip
  title="Add"
  slotProps={{
    popper: {
      sx: {
        [\`&.\${tooltipClasses.popper}[data-popper-placement*="bottom"] .\${tooltipClasses.tooltip}\`]:
          {
            marginTop: '0px',
          },
        [\`&.\${tooltipClasses.popper}[data-popper-placement*="top"] .\${tooltipClasses.tooltip}\`]:
          {
            marginBottom: '0px',
          },
        [\`&.\${tooltipClasses.popper}[data-popper-placement*="right"] .\${tooltipClasses.tooltip}\`]:
          {
            marginLeft: '0px',
          },
        [\`&.\${tooltipClasses.popper}[data-popper-placement*="left"] .\${tooltipClasses.tooltip}\`]:
          {
            marginRight: '0px',
          },
      },
    },
  }}
>
  <Button>Margin</Button>
</Tooltip>`;

const triggersCode = `const TriggersTooltips = () => {
  const [open, setOpen] = useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Grid container>
        <Grid>
          <Tooltip disableFocusListener title="Add">
            <Button>Hover or touch</Button>
          </Tooltip>
        </Grid>
        <Grid>
          <Tooltip disableHoverListener title="Add">
            <Button>Focus or touch</Button>
          </Tooltip>
        </Grid>
        <Grid>
          <Tooltip disableFocusListener disableTouchListener title="Add">
            <Button>Hover</Button>
          </Tooltip>
        </Grid>
        <Grid>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title="Add"
              >
                <Button onClick={handleTooltipOpen}>Click</Button>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Grid>
      </Grid>
    </div>
  );
}
render(<TriggersTooltips />)`;

const controlledTooltipsCode = `const ControlledTooltips = () => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Tooltip open={open} onClose={handleClose} onOpen={handleOpen} title="Add">
      <Button>Controlled</Button>
    </Tooltip>
  );
}
render(<ControlledTooltips />)`;

const variableWidthCode = `const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [\`& .\${tooltipClasses.tooltip}\`]: {
    maxWidth: 500,
  },
});

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [\`& .\${tooltipClasses.tooltip}\`]: {
    maxWidth: 'none',
  },
});

const longText = \`
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
\`;

const VariableWidth = () => {
  return (
    <div>
      <Tooltip title={longText}>
        <Button sx={{ m: 1 }}>Default Width [300px]</Button>
      </Tooltip>
      <CustomWidthTooltip title={longText}>
        <Button sx={{ m: 1 }}>Custom Width [500px]</Button>
      </CustomWidthTooltip>
      <NoMaxWidthTooltip title={longText}>
        <Button sx={{ m: 1 }}>No wrapping</Button>
      </NoMaxWidthTooltip>
    </div>
  );
}
render(<VariableWidth />)`;

const notInteractiveCode = `<Tooltip title="Add" disableInteractive>
  <Button>Not interactive</Button>
</Tooltip>`;

const disabledElementsCode = `<Tooltip title="You don't have permission to do this">
  <span>
    <Button disabled>A Disabled Button</Button>
  </span>
</Tooltip>`;

const transitionsCode = `<div>
  <Tooltip title="Add">
    <Button>Grow</Button>
  </Tooltip>
  <Tooltip
    slots={{ transition: Fade }}
    slotProps={{
      transition: {
        timeout: 600,
      },
    }}
    title="Add"
  >
    <Button>Fade</Button>
  </Tooltip>
  <Tooltip slots={{ transition: Zoom }} title="Add">
    <Button>Zoom</Button>
  </Tooltip>
</div>`;

const followCursorCode = `<Tooltip title="You don't have permission to do this" followCursor>
  <Box sx={{ maxWidth: 300, p: 2, bgcolor: 'text.disabled', color: 'background.paper' }}>
    Disabled Action
  </Box>
</Tooltip>`;

const virtualElementCode = `const AnchorElTooltips = () => {
  const positionRef = useRef({
    x: 0,
    y: 0,
  });
  const popperRef = useRef(null);
  const areaRef = useRef(null);

  const handleMouseMove = (event) => {
    positionRef.current = { x: event.clientX, y: event.clientY };

    if (popperRef.current != null) {
      popperRef.current.update();
    }
  };

  return (
    <Tooltip
      title="Add"
      placement="top"
      arrow
      PopperProps={{
        popperRef,
        anchorEl: {
          getBoundingClientRect: () => {
            return new DOMRect(
              positionRef.current.x,
              areaRef.current.getBoundingClientRect().y,
              0,
              0,
            );
          },
        },
      }}
    >
      <Box
        ref={areaRef}
        onMouseMove={handleMouseMove}
        sx={{ maxWidth: 300, bgcolor: 'primary.main', color: 'primary.contrastText', p: 2 }}
      >
        Hover
      </Box>
    </Tooltip>
  );
}
render(<AnchorElTooltips />)`;

const showingAndHidingCode = `<Tooltip title="Add" enterDelay={500} leaveDelay={200}>
  <Button>[500ms, 200ms]</Button>
</Tooltip>`;

const TooltipDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Tooltip',
        description:
          'Tooltips display informative text when users hover over, focus on, or tap on element.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Tooltip',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-tooltip`,
        folderLink: `${folderBaseLink}/TooltipDoc.jsx`,
      }}
    >
      <DocSection title="Basic tooltip">
        <DocCard code={basicTooltipCode} />
      </DocSection>
      <DocSection
        title="Positioned tooltips"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>Tooltip</Code> has 12 <strong>placement</strong> choices. They don't have
            directional arrows; instead, they rely on motion emanating from the source to convey
            direction.
          </Typography>
        }
      >
        <DocCard code={positionedTooltipsCode} />
      </DocSection>
      <DocSection
        title="Arrow tooltips"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can use the <Code>arrow</Code> prop to give your tooltip an arrow indicating which
            element it refers to. Default is <Code>true</Code>.
          </Typography>
        }
      >
        <DocCard code={arrowTooltipsCode} />
      </DocSection>
      <DocSection
        title="Distance from anchor"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            To adjust the distance between the tooltip and its anchor, you can use the{' '}
            <Code>slotProps</Code> prop to modify the{' '}
            <Link href="https://popper.js.org/docs/v2/modifiers/offset" target="_blank">
              offset
            </Link>{' '}
            of the popper.
          </Typography>
        }
      >
        <DocCard code={distanceFromAnchorOffsetCode} sx={{ mb: 4 }} />
        <Typography
          variant="body1"
          sx={{
            mb: 5,
          }}
        >
          Alternatively, you can use the <Code>slotProps</Code> prop to customize the margin of the
          popper.
        </Typography>
        <DocCard code={distanceFromAnchorMarginCode} />
      </DocSection>
      <DocSection
        title="Triggers"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can define the types of events that cause a tooltip to show. The touch action
            requires long press due to the <Code>enterTouchDelay</Code> prop being set to{' '}
            <Code>700</Code>ms by default.
          </Typography>
        }
      >
        <DocCard code={triggersCode} noInline />
      </DocSection>
      <DocSection
        title="Controlled tooltips"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can use the <Code>open</Code>, <Code>onOpen</Code> and <Code>onClose</Code> props to
            control the behavior of the tooltip.
          </Typography>
        }
      >
        <DocCard code={controlledTooltipsCode} noInline />
      </DocSection>
      <DocSection
        title="Variable width"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>Tooltip</Code> wraps long text by default to make it readable.
          </Typography>
        }
      >
        <DocCard code={variableWidthCode} noInline />
      </DocSection>
      <DocSection
        title="Interractive"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Tooltips are interactive by default. It won't close when the user hovers over the
            tooltip before the <Code>leaveDelay</Code> is expired. You can disable this behavior by
            passing <Code>disableInteractive</Code>.
          </Typography>
        }
      >
        <DocCard code={notInteractiveCode} />
      </DocSection>
      <DocSection
        title="Disabled elements"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default disabled elements like <Code>{`<button>`}</Code> do not trigger user
            interactions so a <Code>Tooltip</Code> will not activate on normal events like hover. To
            accomodate disabled elements, add a simple wrapper element, such as a <Code>span</Code>.
          </Typography>
        }
      >
        <DocCard code={disabledElementsCode} />
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
            Use a different transition component. Default is <Code>Grow</Code>.
          </Typography>
        }
      >
        <DocCard code={transitionsCode} />
      </DocSection>
      <DocSection
        title="Follow cursor"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can enable the tooltip to follow the cursor by setting{' '}
            <Code>followCursor={`{true}`}</Code>
          </Typography>
        }
      >
        <DocCard code={followCursorCode} />
      </DocSection>
      <DocSection
        title="Virtual element"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            In the event you need to implement a custom placement, you can use the{' '}
            <Code>anchorEl</Code> prop: The value of the <Code>anchorEl</Code> prop can be a
            reference to a fake DOM element. You need to create an object shaped like the{' '}
            <Link href="https://popper.js.org/docs/v2/virtual-elements">
              <Code>VirtualElement</Code>
            </Link>
            .
          </Typography>
        }
      >
        <DocCard code={virtualElementCode} noInline />
      </DocSection>
      <DocSection
        title="Showing and hiding"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The tooltip is normally shown immediately when the user's mouse hovers over the
              element, and hides immediately when the user's mouse leaves. A delay in showing or
              hiding the tooltip can be added through the <Code>enterDelay</Code> and{' '}
              <Code>leaveDelay</Code> props.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              On mobile, the tooltip is displayed when the user longpresses the element and hides
              after a delay of 1500ms. You can disable this feature with the{' '}
              <Code>disableTouchListener</Code> prop.
            </Typography>
          </>
        }
      >
        <DocCard code={showingAndHidingCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default TooltipDoc;
