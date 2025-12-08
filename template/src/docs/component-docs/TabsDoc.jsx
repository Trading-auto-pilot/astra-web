import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicTabsCode = `
const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={\`custom-tabpanel-\${index}\`}
      aria-labelledby={\`custom-tab-\${index}\`}
      {...other}
    >
      {value === index && <Box sx={{ px: 2, py: 3 }}>{children}</Box>}
    </div>
  );
};

const BasicTabs = () => {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 1 }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Tab1" value={1} />
        <Tab label="Tab2" value={2} />
        <Tab label="Tab3" value={3} disabled />
      </Tabs>
      <Divider />
      <Box bgcolor="background.elevation2" sx={{ mt: 2 }}>
        <CustomTabPanel value={value} index={1}>
          <Typography variant="subtitle1">
            Adventure awaits in every corner, from the highest mountains to the deepest seas. \n \t  \t \t \t \tEmbrace the unknown with open arms.
          </Typography>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Typography variant="subtitle1">
            In the quiet moments, we find our deepest thoughts and dreams. \n \t  \t \t \t \tLet the silence guide you to new horizons.
          </Typography>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Typography variant="subtitle1">
            Colors dance in the evening sky, painting memories that last a lifetime. \n \t  \t \t \t \tHold onto the beauty of fleeting moments.
          </Typography>
        </CustomTabPanel>
      </Box>
    </Box>
  );
};
render(<BasicTabs />);
`.trim();

const labTabsCode = `
// MUI Lab imports
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const LabTabs = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 1, typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Item One" value="1" />
            <Tab label="Item Two" value="2" />
            <Tab label="Item Three" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">Item One</TabPanel>
        <TabPanel value="2">Item Two</TabPanel>
        <TabPanel value="3">Item Three</TabPanel>
      </TabContext>
    </Box>
  );
};
render(<LabTabs/>)
`.trim();

const tabsWrappedLabelCode = `
const TabsWrappedLabel = () => {
  const [value, setValue] = useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: 1 }}>
      <Tabs variant="scrollable" value={value} onChange={handleChange} textColor="secondary"
        indicatorColor="secondary" aria-label="wrapped label tabs example">
        <Tab
          value="one"
          label="New Arrivals in the Longest Text of Nonfiction that should appear in the next line"
          wrapped
        />
        <Tab value="two" label="Item Two" />
        <Tab value="three" label="Item Three" />
      </Tabs>
    </Box>
  );
};
render(<TabsWrappedLabel/>)
`.trim();

const fixTabsCode = `
const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={\`custom-tabpanel-\${index}\`}
      aria-labelledby={\`custom-tab-\${index}\`}
      {...other}
    >
      {value === index && <Box sx={{ px: 2, py: 3 }}>{children}</Box>}
    </div>
  );
};

const FullWidthTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.elevation1', width: 500 }}>
        <AppBar position="static" color="primary">
          <Tabs
            indicatorColor="primary"
            value={value}
            onChange={handleChange}
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Item One" />
            <Tab label="Item Two" />
            <Tab label="Item Three" />
          </Tabs>
        </AppBar>
        <>
          <CustomTabPanel value={value} index={0}>
            Item One
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            Item Two
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            Item Three
          </CustomTabPanel>
        </>
      </Box>
    </Stack>
  );
};
render(<FullWidthTabs/>)
`.trim();

const centeredTabsCode = `
const CenteredTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
     <Box sx={{ width: 1 }}>
  		<AppBar position="static" enableColorOnDark>
  			<Tabs value={value} onChange={handleChange} centered>
  				<Tab label="Item One" />
  				<Tab label="Item Two" />
  				<Tab label="Item Three" />
  			</Tabs>
  		</AppBar>
	 </Box>
  );
};
render(<CenteredTabs/>)
`.trim();

const iconTabsCode = `
const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={\`custom-tabpanel-\${index}\`}
      aria-labelledby={\`custom-tab-\${index}\`}
      {...other}
    >
      {value === index && <Box sx={{ px: 2, py: 3 }}>{children}</Box>}
    </div>
  );
};

const IconTabs = () => {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Box sx={{ bgcolor: 'background.paper', width: 500 }}>
        <Tabs
          variant="fullWidth"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
          aria-label="icon tabs example"
        >
          <Tab
            label="Recent"
            value={1}
            icon={
              <IconifyIcon
                icon="material-symbols-light:phone-in-talk-outline-sharp"
                width={20}
                height={20}
              />
            }
            iconPosition="top"
          />
          <Tab
            label="Favourite"
            value={2}
            icon={
              <IconifyIcon
                icon="material-symbols:favorite-outline-rounded"
                width={20}
                height={20}
              />
            }
            iconPosition="top"
          />
          <Tab
            label="Contact"
            value={3}
            icon={
              <IconifyIcon
                icon="material-symbols-light:import-contacts-outline"
                width={20}
                height={20}
              />
            }
            iconPosition="top"
          />
        </Tabs>
        <Divider />
        <Box bgcolor="background.elevation2" sx={{ mt: 2 }}>
          <CustomTabPanel value={value} index={1}>
            <Typography variant="subtitle1">
              Adventure awaits in every corner, from the highest mountains to the deepest seas.
              Embrace the unknown with open arms.
            </Typography>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Typography variant="subtitle1">
              In the quiet moments, we find our deepest thoughts and dreams.
              Let the silence guide you to new horizons.
            </Typography>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <Typography variant="subtitle1">
              Colors dance in the evening sky, painting memories that last a lifetime.
              Hold onto the beauty of fleeting moments.
            </Typography>
          </CustomTabPanel>
        </Box>
      </Box>
    </Stack>
  );
};
render(<IconTabs />);
`.trim();

const iconPositionTabsCode = `
const IconPositionTabs = () => {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="icon position tabs example"
      >
        <Tab
          icon={
            <IconifyIcon
              icon="material-symbols:account-circle"
              width={20}
              height={20}
            />
          }
          label="top"
        />
        <Tab
          icon={
            <IconifyIcon
              icon="material-symbols:smartphone-outline"
              width={20}
              height={20}
            />
          }
          iconPosition="start"
          label="start"
        />
        <Tab
          icon={
            <IconifyIcon
              icon="material-symbols-light:favorite"
              width={20}
              height={20}
            />
          }
          iconPosition="end"
          label="end"
        />
        <Tab
          icon={
            <IconifyIcon
              icon="material-symbols:phone-in-talk"
              width={20}
              height={20}
            />
          }
          iconPosition="bottom"
          label="bottom"
        />
      </Tabs>
    </Stack>
  );
};
render(<IconPositionTabs />);
`.trim();

const scrollableTabsCode = `
const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={\`custom-tabpanel-\${index}\`}
      aria-labelledby={\`custom-tab-\${index}\`}
      {...other}
    >
      {value === index && <Box sx={{ px: 2, py: 3 }}>{children}</Box>}
    </div>
  );
};

const ScrollableTabs = () => {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ justifyContent: 'center', alignItems: 'stretch' }}>
      <Box sx={{ maxWidth: { xs: 280, sm: 400 }, bgcolor: 'background.paper', height: 1 }}>
        <Tabs
          variant="scrollable"
          scrollButtons="auto"
          value={value}
          onChange={handleChange}
          aria-label="scrollable tabs example"
        >
          <Tab
            label="Tab1"
            value={1}
            icon={<Chip label="99" color="primary" variant="filled" />}
            iconPosition="end"
          />
          <Tab
            label="Tab2"
            value={2}
            icon={<Chip label="99" color="primary" variant="soft" />}
            iconPosition="end"
          />
          <Tab
            label="Tab3"
            value={3}
            icon={<Chip label="99" color="primary" variant="outlined" />}
            iconPosition="end"
          />
          <Tab
            label="Tab4"
            value={4}
            iconPosition="start"
          />
          <Tab
            label="Tab5"
            value={5}
            iconPosition="start"
          />
          <Tab
            label="Tab6"
            value={6}
            iconPosition="end"
          />
          <Tab
            label="Tab7"
            value={7}
            iconPosition="end"
            disabled
          />
        </Tabs>
      </Box>
    </Stack>
  );
};
render(<ScrollableTabs />);
`.trim();

const verticalTabsCode = `
const CustomTabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={\`custom-tabpanel-\${index}\`}
      aria-labelledby={\`custom-tab-\${index}\`}
      {...other}
    >
      {value === index && <Box sx={{ px: 2, py: 3 }}>{children}</Box>}
    </div>
  );
};

const VerticalTabs = () => {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ flexGrow: 1, bgcolor: 'background.paper', height: 224, width: 1 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
      >
        <Tab
          label="Tab1"
          value={1}
          icon={<Chip label="99" color="primary" variant="filled" />}
          iconPosition="end"
          sx={{ pr: 2 }}
        />
        <Tab
          label="Tab2"
          value={2}
          icon={<Chip label="99" color="primary" variant="soft" />}
          iconPosition="end"
          sx={{ pr: 2 }}
        />
        <Tab
          label="Tab3"
          value={3}
          icon={<Chip label="99" color="primary" variant="outlined" />}
          iconPosition="end"
          sx={{ pr: 2 }}
        />
      </Tabs>
      <Divider orientation="vertical" />
      <Box bgcolor="background.paper">
        <CustomTabPanel value={value} index={1}>
          <Typography variant="subtitle1">
            Item 1
          </Typography>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Typography variant="subtitle1">
            Item 2
          </Typography>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <Typography variant="subtitle1">
            Item 3
          </Typography>
        </CustomTabPanel>
      </Box>
    </Stack>
  );
};

render(<VerticalTabs />);
`.trim();

const navTabsCode = `
// MUI Lab Imports
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const NavTabs = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TabContext value={value}>
      <TabList onChange={handleChange} aria-label="nav tabs example">
        <Tab
          value="1"
          component={Link}
          label="Tab 1"
          href="/drafts"
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value="2"
          component={Link}
          label="Tab 2"
          href="/trash"
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
        <Tab
          value="3"
          component={Link}
          label="Tab 3"
          href="/spam"
          onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
        />
      </TabList>
      <TabPanel value="1">
        <Typography>
          Lemon tart cookie jelly beans marshmallow toffee. Donut brownie bonbon pie croissant candy.
        </Typography>
      </TabPanel>
      <TabPanel value="2">
        <Typography>
          Muffin cheesecake jelly ice cream. Pudding candy bear claw croissant marshmallow pie.
        </Typography>
      </TabPanel>
      <TabPanel value="3">
        <Typography>
          Lollipop gingerbread tart macaroon toffee chocolate. Marshmallow brownie candy lemon tart.
        </Typography>
      </TabPanel>
    </TabContext>
  );
};
render(<NavTabs />);
`.trim();

const TabsDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Tabs',
        description: 'Tabs make it easy to explore and switch between different views.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Tabs',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-tabs`,
        folderLink: `${folderBaseLink}/TabsDoc.jsx`,
      }}
    >
      <DocSection title="Basic Tabs">
        <DocCard code={basicTabsCode} noInline />
      </DocSection>
      <DocSection title="Accessible Tabs">
        <DocCard code={labTabsCode} scope={{ TabContext, TabList, TabPanel }} noInline />
      </DocSection>
      <DocSection title="Wrapped Label">
        <DocCard code={tabsWrappedLabelCode} noInline />
      </DocSection>
      <DocSection title="Fixed Tabs">
        <DocNestedSection title="Full width" id="full-width">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The &nbsp;<Code>variant="fullWidth"</Code>&nbsp; prop should be used for smaller views.
          </Typography>
          <DocCard code={fixTabsCode} noInline sx={{ my: 5 }} />
        </DocNestedSection>
        <DocNestedSection title="Centered" id="centered">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>centered</Code> prop should be used for larger views.
          </Typography>
          <DocCard code={centeredTabsCode} noInline />
        </DocNestedSection>
      </DocSection>
      <DocSection title="With Icon">
        <DocCard code={iconTabsCode} noInline />
      </DocSection>
      <DocSection title="Icon Position">
        <DocCard code={iconPositionTabsCode} noInline />
      </DocSection>
      <DocSection title="Scrollable Tabs">
        <DocNestedSection title="Automatic scroll buttons" id="automatic-scroll-buttons">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the &nbsp;<Code>variant="scrollable"</Code>&nbsp; and &nbsp;
            <Code>scrollButtons="auto"</Code>&nbsp; props to display left and right scroll buttons
            on desktop that are hidden on mobile:
          </Typography>
          <DocCard code={scrollableTabsCode} noInline sx={{ my: 5 }} />
        </DocNestedSection>
        <DocNestedSection title="Forced scroll buttons" id="forced-scroll-buttons">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Apply &nbsp;<Code>{`scrollButtons="true"`}</Code>&nbsp; and the &nbsp;
            <Code>allowScrollButtonsMobile</Code>&nbsp; prop to display the left and right scroll
            buttons on all viewports:
          </Typography>
          <DocCard code={scrollableTabsCode} noInline />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Vertical Tabs"
        description=" "
        descriptionEl={
          <Typography variant="body1">
            To make vertical tabs instead of default horizontal ones, there is &nbsp;
            <Code>orientation="vertical"</Code>&nbsp;.
          </Typography>
        }
      >
        <DocCard code={verticalTabsCode} noInline />
      </DocSection>
      <DocSection
        title="Nav Tabs"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default, tabs use a &nbsp;<Code>button</Code>&nbsp; element. Use &nbsp;
            <Code>component</Code>&nbsp; prop to change the Tab component to the component of your
            choice.
          </Typography>
        }
      >
        <DocCard code={navTabsCode} scope={{ TabContext, TabList, TabPanel }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default TabsDoc;
