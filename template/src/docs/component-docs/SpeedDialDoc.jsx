import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicSpeedDialCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const BasicSpeedDial = () => {
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
render(<BasicSpeedDial />)`;

const directionUpCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const DirectionUpSpeedDial = () => {
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
			<Box sx={{ position: 'relative', mt: 3, height: 270 }}>
				<SpeedDial
					ariaLabel="SpeedDial playground example"
					icon={<SpeedDialIcon />}
					direction='up'
					sx={{
						position: 'absolute',
						[\`&.\${speedDialClasses.directionUp}\`]: {
								bottom: 2,
								left: 2,
						},
					}}
				>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
						/>
					))}
				</SpeedDial>
			</Box>
		</Box>
  );
}
render(<DirectionUpSpeedDial />)`;

const directionLeftCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const DirectionLeftSpeedDial = () => {
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
			<Box sx={{ position: 'relative', mt: 3, height: 270 }}>
				<SpeedDial
					ariaLabel="SpeedDial playground example"
					icon={<SpeedDialIcon />}
					direction='left'
					sx={{
						position: 'absolute',
						[\`&.\${speedDialClasses.directionLeft}\`]: {
								bottom: 2,
								right: 2,
						},
					}}
				>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
						/>
					))}
				</SpeedDial>
			</Box>
		</Box>
  );
}
render(<DirectionLeftSpeedDial />)`;

const directionRightCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const DirectionRightSpeedDial = () => {
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
			<Box sx={{ position: 'relative', mt: 3, height: 270 }}>
				<SpeedDial
					ariaLabel="SpeedDial playground example"
					icon={<SpeedDialIcon />}
					direction='right'
					sx={{
						position: 'absolute',
						[\`&.\${speedDialClasses.directionRight}\`]: {
								top: 2,
								left: 2,
						},
					}}
				>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
						/>
					))}
				</SpeedDial>
			</Box>
		</Box>
  );
}
render(<DirectionRightSpeedDial />)`;

const directionDownCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const DirectionDownSpeedDial = () => {
  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
			<Box sx={{ position: 'relative', mt: 3, height: 270 }}>
				<SpeedDial
					ariaLabel="SpeedDial playground example"
					icon={<SpeedDialIcon />}
					direction='down'
					sx={{
						position: 'absolute',
						[\`&.\${speedDialClasses.directionDown}\`]: {
								top: 2,
								right: 2,
						},
					}}
				>
					{actions.map((action) => (
						<SpeedDialAction
							key={action.name}
							icon={action.icon}
							tooltipTitle={action.name}
						/>
					))}
				</SpeedDial>
			</Box>
		</Box>
  );
}
render(<DirectionDownSpeedDial />)`;

const controlledSpeedDialCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const ControlledOpenSpeedDial = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial controlled open example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
render(<ControlledOpenSpeedDial />)`;

const customCloseIconCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const OpenIconSpeedDial = () => {
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon openIcon={<IconifyIcon icon="material-symbols:edit" sx={{ fontSize: 24 }} />} />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
render(<OpenIconSpeedDial />)`;

const persistentTooltipsCode = `const actions = [
  { icon: <IconifyIcon icon="material-symbols:file-copy" sx={{ fontSize: 24 }} />, name: 'Copy' },
  { icon: <IconifyIcon icon="material-symbols:save" sx={{ fontSize: 24 }} />, name: 'Save' },
  { icon: <IconifyIcon icon="material-symbols:print" sx={{ fontSize: 24 }} />, name: 'Print' },
  { icon: <IconifyIcon icon="material-symbols:share" sx={{ fontSize: 24 }} />, name: 'Share' },
];

const SpeedDialTooltipOpen = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ height: 330, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
render(<SpeedDialTooltipOpen />)`;

const SpeedDialDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Speed Dial',
        description:
          'When pressed, a floating action button can display three to six related actions in the form of a Speed Dial.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'SpeedDial',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-speed-dial`,
        folderLink: `${folderBaseLink}/SpeedDialDoc.jsx`,
      }}
    >
      <DocSection title="Basic speed dial">
        <DocCard code={basicSpeedDialCode} noInline />
      </DocSection>
      <DocSection
        title="Speed dial directions"
        description="Speed dials have four different directions (up, right, down, left)."
      >
        <DocCard code={directionUpCode} noInline sx={{ mb: 4 }} />
        <DocCard code={directionRightCode} noInline sx={{ mb: 4 }} />
        <DocCard code={directionDownCode} noInline sx={{ mb: 4 }} />
        <DocCard code={directionLeftCode} noInline sx={{ mb: 4 }} />
      </DocSection>
      <DocSection
        title="Controlled speed dial"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The open state of the component can be controlled with the <Code>open</Code>/
            <Code>onOpen</Code>/<Code>onClose</Code> prop.
          </Typography>
        }
      >
        <DocCard code={controlledSpeedDialCode} noInline />
      </DocSection>
      <DocSection
        title="Custom close icon"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can provide an alternate icon for the closed and open states using the{' '}
            <Code>icon</Code> and <Code>openIcon</Code> props of the <Code>SpeedDialIcon</Code>{' '}
            component.
          </Typography>
        }
      >
        <DocCard code={customCloseIconCode} noInline />
      </DocSection>
      <DocSection
        title="Persistent action tooltips"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The SpeedDialActions tooltips can be displayed persistently so that users don't have
              to long-press to see the tooltip on touch devices.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              It is enabled here across all devices for demo purposes, but in production it could
              use the <Code>isTouch</Code> logic to conditionally set the prop.
            </Typography>
          </>
        }
      >
        <DocCard code={persistentTooltipsCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default SpeedDialDoc;
