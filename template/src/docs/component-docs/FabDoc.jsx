import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { green } from 'theme/palette/colors';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicFabCode = `<Stack spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
  <Fab aria-label="add">
    <IconifyIcon 
      icon="material-symbols:add" 
      sx={{ fontSize: 24 }} 
    />
  </Fab>
  <Fab color="secondary" aria-label="edit">
    <IconifyIcon 
      icon="material-symbols:edit" 
      sx={{ fontSize: 24 }} 
    />
  </Fab>
  <Fab color="default" variant="extended">
    <IconifyIcon 
      icon="material-symbols:navigation" 
      sx={{ fontSize: 24, mr: 1 }} 
    />
    Navigate
  </Fab>
  <Fab disabled aria-label="like">
    <IconifyIcon 
      icon="material-symbols:favorite" 
      sx={{ fontSize: 24 }} 
    />
  </Fab>
</Stack>`;

const colorsCode = `<Stack direction="column" spacing={2}>
  <Stack spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <Fab color="neutral" aria-label="add">
      <IconifyIcon 
        icon="material-symbols:add" 
        sx={{ fontSize: 24 }} 
      />
    </Fab>
    <Fab aria-label="add">
      <IconifyIcon 
        icon="material-symbols:add" 
        sx={{ fontSize: 24 }} 
      />
    </Fab>
    <Fab color="secondary" aria-label="add">
      <IconifyIcon 
        icon="material-symbols:add" 
        sx={{ fontSize: 24 }} 
      />
    </Fab>
    <Fab color="success" aria-label="add">
      <IconifyIcon 
        icon="material-symbols:add" 
        sx={{ fontSize: 24 }} 
      />
    </Fab>
    <Fab color="info" aria-label="add">
      <IconifyIcon 
        icon="material-symbols:add" 
        sx={{ fontSize: 24 }} 
      />
    </Fab>
    <Fab color="warning" aria-label="add">
      <IconifyIcon 
        icon="material-symbols:add" 
        sx={{ fontSize: 24 }} 
      />
    </Fab>
    <Fab color="error" aria-label="add">
      <IconifyIcon 
        icon="material-symbols:add" 
        sx={{ fontSize: 24 }} 
      />
    </Fab>
  </Stack>
  <Stack spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <Fab variant="extended" color="neutral">
      <IconifyIcon 
      icon="material-symbols:navigation" 
      sx={{ fontSize: 24, mr: 1 }} />
      Extended
    </Fab>
    <Fab variant="extended">
      <IconifyIcon 
      icon="material-symbols:navigation" 
      sx={{ fontSize: 24, mr: 1 }} />
      Extended
    </Fab>
    <Fab variant="extended" color="secondary">
      <IconifyIcon 
      icon="material-symbols:navigation" 
      sx={{ fontSize: 24, mr: 1 }} />
      Extended
    </Fab>
    <Fab variant="extended" color="success">
      <IconifyIcon 
      icon="material-symbols:navigation" 
      sx={{ fontSize: 24, mr: 1 }} />
      Extended
    </Fab>
    <Fab variant="extended" color="info">
      <IconifyIcon 
        icon="material-symbols:navigation" 
        sx={{ fontSize: 24, mr: 1 }} />
      Extended
    </Fab>
    <Fab variant="extended" color="warning">
      <IconifyIcon 
        icon="material-symbols:navigation" 
        sx={{ fontSize: 24, mr: 1 }} 
      />
      Extended
    </Fab>
    <Fab variant="extended" color="error">
      <IconifyIcon 
        icon="material-symbols:navigation" 
        sx={{ fontSize: 24, mr: 1 }} 
      />
      Extended
    </Fab>
  </Stack>
</Stack>`;

const sizesCode = `<Stack direction="column" spacing={2}>
  <Stack spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <Fab size="small" color="secondary" aria-label="add">
      <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 24 }} />
    </Fab>
    <Fab size="medium" color="secondary" aria-label="add">
      <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 24 }} />
    </Fab>
    <Fab color="secondary" aria-label="add">
      <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 24 }} />
    </Fab>
  </Stack>
  <Stack spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <Fab variant="extended" size="small" color="primary">
      <IconifyIcon 
        icon="material-symbols:navigation" 
        sx={{ fontSize: 24, mr: 1 }} 
      />
      Extended
    </Fab>
    <Fab variant="extended" size="medium" color="primary">
      <IconifyIcon 
        icon="material-symbols:navigation" 
        sx={{ fontSize: 24, mr: 1 }} 
      />
      Extended
    </Fab>
    <Fab variant="extended" color="primary">
      <IconifyIcon 
        icon="material-symbols:navigation" 
        sx={{ fontSize: 24, mr: 1 }} 
      />
      Extended
    </Fab>
  </Stack>
</Stack>`;

const zoomAnimationFabCode = `const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={\`action-tabpanel-\${index}\`}
      aria-labelledby={\`action-tab-\${index}\`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </Typography>
  );
}

const a11yProps = (index) => {
  return {
    id: \`action-tab-\${index}\`,
    'aria-controls': \`action-tabpanel-\${index}\`,
  };
}

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

const FloatingActionButtonZoom = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const fabs = [
    {
      color: 'primary',
      sx: fabStyle,
      icon: <IconifyIcon icon="material-symbols:add" sx={{ fontSize: 24 }} />,
      label: 'Add',
    },
    {
      color: 'secondary',
      sx: fabStyle,
      icon: <IconifyIcon icon="material-symbols:edit" sx={{ fontSize: 24 }} />,
      label: 'Edit',
    },
    {
      color: 'success',
      sx: { ...fabStyle, color: 'common.white' },
      icon: <IconifyIcon icon="material-symbols:keyboard-arrow-up" sx={{ fontSize: 24 }} />,
      label: 'Expand',
    },
  ];

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        width: 1,
        maxWidth: 500,
        position: 'relative',
        minHeight: 200,
      }}
    >
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="action tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0} dir={theme.direction}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        Item Three
      </TabPanel>
      {fabs.map((fab, index) => (
        <Zoom
          key={fab.color}
          in={value === index}
          timeout={transitionDuration}
          style={{
            transitionDelay: \`\${value === index ? transitionDuration.exit : 0}ms\`,
          }}
          unmountOnExit
        >
          <Fab sx={fab.sx} aria-label={fab.label} color={fab.color}>
            {fab.icon}
          </Fab>
        </Zoom>
      ))}
    </Box>
  );
}
render(<FloatingActionButtonZoom />);`;

const FabDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Floating Action Button',
        description:
          'A Floating Action Button (FAB) performs the primary, or most common, action on a screen.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Floating Action Button',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-floating-action-button`,
        folderLink: `${folderBaseLink}/FabDoc.jsx`,
      }}
    >
      <DocSection title="Basic FAB">
        <DocCard code={basicFabCode} />
      </DocSection>
      <DocSection
        title="Color"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>color</Code> prop can used to control the color of the floating action
            buttons.
          </Typography>
        }
      >
        <DocCard code={colorsCode} />
      </DocSection>
      <DocSection
        title="Size"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default, the size is <Code>large</Code>. Use the <Code>size</Code> prop for smaller
            floating action buttons.
          </Typography>
        }
      >
        <DocCard code={sizesCode} />
      </DocSection>
      <DocSection
        title="Animation"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              The floating action button animates onto the screen as an expanding piece of material,
              by default.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              A floating action button that spans multiple lateral screens (such as tabbed screens)
              should briefly disappear, then reappear if its action changes.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              The Zoom transition can be used to achieve this. Note that since both the exiting and
              entering animations are triggered at the same time, we use <Code>enterDelay</Code> to
              allow the outgoing Floating Action Button's animation to finish before the new one
              enters.
            </Typography>
          </>
        }
      >
        <DocCard code={zoomAnimationFabCode} noInline scope={{ green }} />
      </DocSection>
    </DocPageLayout>
  );
};

export default FabDoc;
