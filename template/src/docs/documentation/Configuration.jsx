import {
  Box,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList, DocSubtitle } from 'components/docs/DocSection';

const configOptions = [
  {
    property: 'textDirection',
    values: 'ltr | rtl',
    defaultValue: 'ltr',
    description: 'Sets the text direction of the application.',
  },
  {
    property: 'navigationMenuType',
    values: 'sidenav | topnav | combo',
    defaultValue: 'sidenav',
    description: 'Determines the style of the navigation menu.',
  },
  {
    property: 'sidenavType',
    values: 'default | stacked | slim',
    defaultValue: 'default',
    description: 'Defines the layout of the side navigation.',
  },
  {
    property: 'sidenavCollapsed',
    values: 'true | false',
    defaultValue: 'false',
    description: 'Toggles whether the side navigation is collapsed or expanded.',
  },
  {
    property: 'topnavType',
    values: 'default | stacked | slim',
    defaultValue: 'default',
    description: 'Defines the layout of the top navigation.',
  },
  {
    property: 'navColor',
    values: 'default | vibrant',
    defaultValue: 'default',
    description: 'Sets the color scheme of the navigation menu.',
  },
  {
    property: 'openNavbarDrawer',
    values: 'true | false',
    defaultValue: 'false',
    description: 'Manages the state of the responsive navbar drawer.',
  },
  {
    property: 'drawerWidth',
    values: 'number',
    defaultValue: 300,
    description: 'Specifies the width of the navigation drawer.',
  },
  {
    property: 'locale',
    values: 'en-US | fr-FR | bn-BD | zh-CN | hi-IN | ar-SA',
    defaultValue: 'en-US',
    description: 'Specifies the language and regional settings for the application.',
  },
];

const Configuration = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Configuration and Settings',
        descriptionEl: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aurora comes with a comprehensive set of configurations that allow you to customize the
            template's behavior and appearance. These settings are managed through the{' '}
            <Code>Config</Code> interface and are stored in the browser's local storage. This allows
            for persistent customization, ensuring that user preferences are maintained across
            sessions.
          </Typography>
        ),
      }}
    >
      <DocSection title="Config file">
        <Stack
          direction="column"
          sx={{
            gap: 2,
            mb: 5,
            color: 'text.secondary',
          }}
        >
          <Typography>
            In Aurora, the configuration file is located at <Code>src/config.js</Code>, which
            defines the default settings for the application. This file contains all the initial
            configuration values used to control the behavior and appearance of the application.
          </Typography>
          <Typography>
            Update the relevant properties within the <Code>initialConfig</Code> object to reflect
            the desired default settings for your application.
          </Typography>
          <CodeBlock
            sx={{ mb: 0 }}
            code={`export const initialConfig = {
  textDirection: 'ltr',
  navigationMenuType: 'sidenav',
  sidenavType: 'default',
  sidenavCollapsed: false,
  topnavType: 'default',
  navColor: 'default',
  openNavbarDrawer: false, // for responsive
  drawerWidth: mainDrawerWidth.full,
  locale: 'en-US',
};`}
          />
        </Stack>
        <Typography sx={{ color: 'text.secondary' }}>
          Before running the application with the new defaults, clear the local storage to remove
          any previously saved configuration values. This will ensure that the application uses the
          updated settings from <Code>src/config.js</Code>.
        </Typography>
      </DocSection>
      <DocSection title="Configuration Options">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Below is an overview of the configuration options available:
        </Typography>
        <TableContainer sx={{ ml: 0, pl: 0, borderRadius: 2 }}>
          <Table aria-label="configuration options table">
            <TableHead>
              <TableRow
                sx={{
                  th: {
                    borderColor: 'divider',
                  },
                }}
              >
                <TableCell>
                  <strong>Property</strong>
                </TableCell>
                <TableCell sx={{ minWidth: 315 }}>
                  <strong>Values</strong>
                </TableCell>
                <TableCell sx={{ minWidth: 225 }}>
                  <strong>Default Value</strong>
                </TableCell>
                <TableCell sx={{ minWidth: 450 }}>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {configOptions.map((option) => (
                <TableRow
                  key={option.property}
                  sx={{
                    td: {
                      borderColor: 'divider',
                    },
                  }}
                >
                  <TableCell>{option.property}</TableCell>
                  <TableCell>
                    <Stack spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                      {option.values.split('|').map((item) => (
                        <Code key={item}>{item}</Code>
                      ))}
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Code>{option.defaultValue}</Code>
                  </TableCell>
                  <TableCell>{option.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DocSection>
      <DocSection title="Managing Configuration">
        <Typography sx={{ color: 'text.secondary', mb: 5 }}>
          Aurora provides a powerful and flexible way to manage configuration settings throughout
          the application using <Code>React Context</Code> and <Code>useReducer</Code>. The
          configuration is managed centrally, ensuring consistent state management and easy updates.
          You can update the configuration using the custom <Code>useSettingsContext</Code> hook.
        </Typography>
        <Stack
          direction="column"
          sx={{
            gap: 2,
            mb: 5,
          }}
        >
          <DocSubtitle>
            Overview of <Code>useSettingsContext</Code>:
          </DocSubtitle>
          <Typography sx={{ color: 'text.secondary' }}>
            This hook is located in the <Code>src/providers/SettingsProvider.jsx</Code> file.
          </Typography>
          <DocList>
            <ListItem>
              <ListItemText disableTypography>
                <Code>config</Code>: The current configuration state, which includes various
                settings like textDirection, sidenavCollapsed, navigationMenuType, etc.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>configDispatch</Code>: The dispatch function for manually triggering actions
                within the settingsReducer.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>setConfig</Code>: A utility function to update the configuration with a
                partial payload.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>handleDrawerToggle</Code>: A function to toggle the state of the navigation
                drawer.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>toggleNavbarCollapse</Code>: A function to collapse or expand the navigation
                bar.
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText disableTypography>
                <Code>getThemeColor</Code>: A utility to resolve CSS variable-based colors at
                runtime, ensuring compatibility with ECharts which requires computed color values.
              </ListItemText>
            </ListItem>
          </DocList>
        </Stack>
        <Box
          sx={{
            mb: 5,
          }}
        >
          <DocSubtitle sx={{ mb: 2 }}>Accessing Configuration Values:</DocSubtitle>
          <Typography sx={{ color: 'text.secondary' }}>
            To access the current configuration values, you can use the useSettingsContext hook.
            Here's an example:
          </Typography>
          <CodeBlock
            code={`const {
  config: { navigationMenuType },
} = useSettingsContext();`}
          />
          <Typography sx={{ color: 'text.secondary' }}>
            In this example, the <Code>navigationMenuType</Code> value is accessed from the global
            configuration and used within the component.
          </Typography>
        </Box>
        <Box
          sx={{
            mb: 5,
          }}
        >
          <DocSubtitle sx={{ mb: 2 }}>Updating Configuration Values:</DocSubtitle>
          <Typography sx={{ color: 'text.secondary' }}>
            To update any configuration value, the useSettingsContext hook provides a setConfig
            function. This function allows you to update one or more configuration values at a time.
            Here’s how to use it:
          </Typography>
          <CodeBlock
            sx={{ mb: 0 }}
            code={`const { config, setConfig } = useSettingsContext();

const updateConfig = () => {
  setConfig({
    sidenavType: 'slim', // Updates the sidenav type to slim
    // Add or update any other config values here
  });
};`}
          />
        </Box>
        <div>
          <DocSubtitle sx={{ mb: 2 }}>Manually Dispatching Actions</DocSubtitle>
          <Typography sx={{ color: 'text.secondary' }}>
            If you need more control over the configuration changes, you can use the configDispatch
            function directly:
          </Typography>
          <CodeBlock
            sx={{ mb: 0 }}
            code={`const { configDispatch } = useSettingsContext();

const handleChangeNavType = () => {
  configDispatch({
    type: SET_NAVIGATION_MENU_TYPE,
    payload: 'topnav',
  });
};`}
          />
        </div>
      </DocSection>
    </DocPageLayout>
  );
};

export default Configuration;
