import { Link, ListItem, ListItemText, Typography, listItemClasses } from '@mui/material';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList, DocSubtitle } from 'components/docs/DocSection';

const Theming = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Theming',
        descriptionEl: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aurora's theming is built by following the official MUI theme{' '}
            <Link href="https://mui.com/material-ui/customization/theming/" target="_blank">
              customization
            </Link>{' '}
            guidelines. The theme is tailored using custom settings, with additional configurations
            carefully crafted to align with Aurora's design principles.
          </Typography>
        ),
      }}
    >
      <DocSection title="Aurora Theme Configuration">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Aurora's theme is built on the Mui default theme. The theme configuration variables are
          centralized in the <Code>src/theme</Code> directory, where various aspects like color
          palettes, typography, shadows, and global styles are organized. The main theme is
          generated in <Code>src/theme/theme.js</Code>, taking advantage of modern{' '}
          <Link
            href="https://mui.com/material-ui/customization/css-theme-variables/overview/"
            target="_blank"
          >
            CSS variable
          </Link>{' '}
          features.
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          The custom theme is injected into the MUI theme through the <Code>ThemeProvider</Code>{' '}
          located in <Code>src/providers/ThemeProvider.jsx</Code>. The entire app is wrapped by this
          <Code>ThemeProvider</Code> in <Code>src/main.jsx</Code>. Within the{' '}
          <Code>ThemeProvider</Code>, RTL support, theme storage key configuration etc. are
          configured, ensuring that the app's visual style adapts according to user preferences and
          settings.
        </Typography>
      </DocSection>
      <DocSection title="CSS Variable Upgrade Guide">
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Aurora now uses <strong>CSS variables</strong> for all core theme tokens, including colors
          and shadows.This modern approach enables:
        </Typography>

        <DocList sx={{ mb: 2 }}>
          <ListItem>
            <ListItemText disableTypography>
              Instant theme switching without page reload
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              Clear visualization of theme tokens in browser dev tools
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              Enhanced dark mode support with no SSR flickering
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText disableTypography>
              Flexibility for multiple color schemes beyond light/dark
            </ListItemText>
          </ListItem>
        </DocList>

        <DocSubtitle>Color and Shadow Access</DocSubtitle>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Use the new <Code>theme.vars</Code> path to access CSS variable-compliant tokens.
        </Typography>
        <CodeBlock
          code={`// ❌ Old
color: theme.palette.common.white;

// ✅ New
color: theme.vars.palette.common.white;

// ❌ Old
boxShadow: theme.shadows[2];

// ✅ New
boxShadow: theme.vars.shadows[2];`}
        />

        <DocSubtitle>Alpha Transparency with CSS Variables</DocSubtitle>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Replace the <Code>alpha()</Code> utility with <Code>cssVarRgba()</Code>, Use theme color
          channels to apply alpha transparency while preserving full CSS variable compatibility.
        </Typography>
        <CodeBlock
          code={`// ❌ Old
import { alpha } from '@mui/material/styles';
alpha(theme.palette.text.primary, 0.2);

// ✅ New
import { cssVarRgba } from 'lib/utils';
cssVarRgba(theme.vars.palette.text.primaryChannel, 0.2);`}
        />
        <DocSubtitle>The useThemeMode Hook</DocSubtitle>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          The <Code>useThemeMode()</Code> hook provides a reliable way to detect and react to the
          current theme mode (light, dark, or system). This is especially useful for dynamic assets,
          like switching between light/dark assets and styles throughout the application, that need
          to adjust based on the active theme.
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          It builds on MUI’s <Code>useColorScheme()</Code> to expose a simple API with{' '}
          <Code>mode</Code>, <Code>isDark</Code>, <Code>systemMode</Code>, and a convenient{' '}
          <Code>setThemeMode()</Code> function for toggling modes.
        </Typography>
        <CodeBlock
          code={`// useThemeMode.js
import { useColorScheme } from '@mui/material';
import { useCallback } from 'react';

export const useThemeMode = () => {
  const { mode, systemMode, setMode } = useColorScheme();
  const isDark = mode === 'system' ? systemMode === 'dark' : mode === 'dark';

  const setThemeMode = useCallback(
    (themeMode) => {
      setMode(themeMode ?? (isDark ? 'light' : 'dark'));
    },
    [setMode, systemMode, mode],
  );

  return { mode, isDark, systemMode, setThemeMode };
};`}
        />

        <DocSubtitle>Dark Mode Styling</DocSubtitle>
        <Typography sx={{ color: 'text.secondary', mb: 2 }}>
          Use <Code>theme.applyStyles('dark', ...)</Code> to target dark mode overrides directly in
          your style functions.
        </Typography>
        <CodeBlock
          code={`// ❌ Old
<Box
  sx={(theme) => ({
    color: theme.palette.mode === 'light'
      ? theme.palette.primary.main
      : theme.palette.primary.light,
    backgroundColor: theme.palette.mode === 'light'
      ? theme.palette.background.paper
      : theme.palette.background.default,
  })}
/>

// ✅ New
<Box
  sx={(theme) => ({
    color: theme.vars.palette.primary.main,
    backgroundColor: theme.vars.palette.background.paper,
    ...theme.applyStyles('dark', {
      color: theme.vars.palette.primary.light,
      backgroundColor: theme.vars.palette.background.default,
    }),
  })}
/>`}
        />

        <DocSubtitle>Related Documentation</DocSubtitle>
        <DocList sx={{ color: 'text.secondary' }}>
          <ListItem>
            <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
              Basic Usage:{' '}
            </DocSubtitle>
            <Link
              href="https://mui.com/material-ui/customization/css-theme-variables/usage/"
              target="_blank"
              rel="noopener"
            >
              Getting Started with CSS Variables
            </Link>
          </ListItem>
          <ListItem>
            <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
              Configuration:{' '}
            </DocSubtitle>
            <Link
              href="https://mui.com/material-ui/customization/css-theme-variables/configuration/"
              target="_blank"
              rel="noopener"
            >
              Configuration: Theming with CSS Variables
            </Link>
          </ListItem>
          <ListItem>
            <DocSubtitle component="span" sx={{ color: 'text.primary' }}>
              Migration Guide:{' '}
            </DocSubtitle>
            <Link
              href="https://mui.com/material-ui/migration/upgrade-to-v7/#theme-behavior-changes"
              target="_blank"
              rel="noopener"
            >
              CSS Variables & Dark Mode
            </Link>
          </ListItem>
        </DocList>
      </DocSection>

      <DocSection title="Color Palette">
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          To create a visually appealing interface, Aurora uses custom colors instead of default Mui
          colors. All color definitions are stored in the <Code>src/theme/palette/colors.js</Code>.
          These colors are then used to create a separate light and dark theme <Code>palette</Code>,
          which extends the default MUI palette with additional customization.
        </Typography>
        <DocSubtitle sx={{ mb: 2 }}>Additional Theme Palette Customizations</DocSubtitle>
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          Aurora extends the default MUI theme palette with several additional options to better
          align with its design needs. Below are the key customizations:
        </Typography>{' '}
        <DocList
          sx={{
            listStyleType: 'decimal',
            [`& .${listItemClasses.root}`]: {
              py: 1,
            },
          }}
        >
          <ListItem>
            <DocSubtitle>Neutral Palette</DocSubtitle>
            <DocList sx={{ color: 'text.secondary' }}>
              <ListItem>
                <Typography>
                  A new neutral color option is added alongside the default <Code>primary</Code>,
                  <Code>secondary</Code>, <Code>error</Code>, <Code>warning</Code>,{' '}
                  <Code>info</Code>, and <Code>success</Code> palettes. This can be used for
                  elements that require a more subdued color tone.
                </Typography>
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem>
            <DocSubtitle>Additional Color Palettes</DocSubtitle>
            <DocList sx={{ color: 'text.secondary' }}>
              <ListItem>
                <Typography>
                  Like the default <Code>grey</Code> platte, additional <Code>chGrey</Code>,{' '}
                  <Code>chBlue</Code>, <Code>chGreen</Code> and <Code>chOrange</Code> palettes have
                  been added. These palettes are introduced primarily for use in charts but can be
                  applied anywhere in the UI.
                </Typography>
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem>
            <DocSubtitle>Extended Color Shades</DocSubtitle>
            <DocList sx={{ color: 'text.secondary' }}>
              <ListItem>
                <Typography>
                  Two additional color options, <Code>lighter</Code> and <Code>darker</Code>, are
                  introduced for each palette color. These are added alongside the default{' '}
                  <Code>main</Code>, <Code>light</Code>, <Code>dark</Code>, and{' '}
                  <Code>contrastText</Code> shades, providing more flexibility in color application.
                </Typography>
              </ListItem>
            </DocList>
          </ListItem>
          <ListItem>
            <DocSubtitle>Background Palette Enhancements</DocSubtitle>
            <DocList sx={{ color: 'text.secondary' }}>
              <ListItem>
                <ListItemText disableTypography>
                  The background palette is extended with several new options:
                </ListItemText>
                <DocList sx={{ py: 0 }}>
                  <ListItem>
                    <ListItemText sx={{ py: '0 !important' }} disableTypography>
                      elevation1
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ py: '0 !important' }} disableTypography>
                      elevation2
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ py: '0 !important' }} disableTypography>
                      elevation3
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ py: '0 !important' }} disableTypography>
                      elevation4
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText sx={{ py: '0 !important' }} disableTypography>
                      menu
                    </ListItemText>
                  </ListItem>
                </DocList>
              </ListItem>
            </DocList>
            <Typography sx={{ color: 'text.secondary' }}>
              These can be used to create nuanced background effects and improve visual depth in the
              UI.
            </Typography>
          </ListItem>
          <ListItem>
            <DocSubtitle>Custom Divider Color</DocSubtitle>
            <DocList sx={{ color: 'text.secondary' }}>
              <ListItem>
                <ListItemText disableTypography>
                  An additional <Code>dividerLight</Code> option is added to the default{' '}
                  <Code>divider</Code> palette. This provides an alternative lighter divider color,
                  which can be useful in various design contexts.
                </ListItemText>
              </ListItem>
            </DocList>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Component Customization">
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          In Aurora, component customization follows the MUI{' '}
          <Link href="https://mui.com/material-ui/customization/theme-components/" target="_blank">
            Global Theme Overrides
          </Link>{' '}
          approach. All overridden components are located in the <Code>src/theme/components</Code>{' '}
          folder. These components are imported and used to create the <Code>theme</Code>, along
          with other theme customization properties, in <Code>src/theme/theme.js</Code>.
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          To customize or add additional functionality, modify or add files within the{' '}
          <Code>components</Code>
          folder and ensure that these changes are incorporated into the <Code>theme.js</Code> file.
          This approach centralizes component customization, making it easier to manage and extend
          the theme.
        </Typography>
      </DocSection>
      <DocSection title="Custom Styles and Third-Party Library Customization">
        <Typography
          sx={{
            color: 'text.secondary',
            mb: 2,
          }}
        >
          For custom styles, CSS rules, third-party library style customizations, and keyframe
          animations, all <Code>JSS (JavaScript Style Sheets)</Code> styles are inside the
          <Code>src/theme/styles</Code> folder. These styles are then imported into
          <Code>src/theme/components/CssBaseline.jsx</Code> and applied using MUI's{' '}
          <Code>styleOverrides</Code>.
        </Typography>
        <DocSubtitle>Example Usage:</DocSubtitle>
        <CodeBlock
          sx={{ mb: 0 }}
          code={`//src/theme/styles/simplebar.js
import { Theme } from '@mui/material';
import 'simplebar-react/dist/simplebar.min.css';

const simplebar = (theme: Theme) => ({
  '& .simplebar-track': {
    '&.simplebar-vertical': {
      '& .simplebar-scrollbar': {
        '&:before': {
          backgroundColor: theme.vars.palette.background.elevation4,
        },
        ...
      },
    },
  },
});
export default simplebar;

//src/theme/components/CssBaseline.jsx
const CssBaseline: Components<Omit<Theme, 'components'>>['MuiCssBaseline'] = {
  defaultProps: {},
  styleOverrides: (theme) => ({
   // other custom styles
    ...simplebar(theme),
  }),
};`}
        />
      </DocSection>
    </DocPageLayout>
  );
};

export default Theming;
