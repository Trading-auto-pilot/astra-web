import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const exclusiveSelectionCode = `const ToggleButtons = () => {
  const [alignment, setAlignment] = useState('left');

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <IconifyIcon icon="material-symbols:format-align-left" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <IconifyIcon icon="material-symbols:format-align-center" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <IconifyIcon icon="material-symbols:format-align-right" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="justify" aria-label="justified" disabled>
        <IconifyIcon icon="material-symbols:format-align-justify" sx={{ fontSize: 24 }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
render(<ToggleButtons />)`;

const multipleSelectionCode = `const ToggleButtonsMultiple = () => {
  const [formats, setFormats] = useState(() => ['bold', 'italic']);

  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  return (
    <ToggleButtonGroup
      value={formats}
      onChange={handleFormat}
      aria-label="text formatting"
    >
      <ToggleButton value="bold" aria-label="bold">
        <IconifyIcon icon="material-symbols:format-bold" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="italic" aria-label="italic">
        <IconifyIcon icon="material-symbols:format-italic" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="underlined" aria-label="underlined">
        <IconifyIcon icon="material-symbols:format-underlined" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="color" aria-label="color" disabled>
        <IconifyIcon icon="material-symbols:format-color-fill" sx={{ fontSize: 24 }} />
        <IconifyIcon icon="material-symbols:arrow-drop-down" sx={{ fontSize: 24 }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
render(<ToggleButtonsMultiple />)`;

const sizesCode = `const ToggleButtonSizes = () => {
  const [alignment, setAlignment] = useState('left');

  const handleChange = (_event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const children = [
    <ToggleButton value="left" key="left">
      <IconifyIcon icon="material-symbols:format-align-left" sx={{ fontSize: 24 }} />
    </ToggleButton>,
    <ToggleButton value="center" key="center">
      <IconifyIcon icon="material-symbols:format-align-center" sx={{ fontSize: 24 }} />
    </ToggleButton>,
    <ToggleButton value="right" key="right">
      <IconifyIcon icon="material-symbols:format-align-right" sx={{ fontSize: 24 }} />
    </ToggleButton>,
    <ToggleButton value="justify" key="justify">
      <IconifyIcon icon="material-symbols:format-align-justify" sx={{ fontSize: 24 }} />
    </ToggleButton>,
  ];

  const control = {
    value: alignment,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <Stack direction="column" spacing={2}>
      <ToggleButtonGroup size="small" {...control} aria-label="Small sizes">
        {children}
      </ToggleButtonGroup>
      <ToggleButtonGroup {...control} aria-label="Medium sizes">
        {children}
      </ToggleButtonGroup>
      <ToggleButtonGroup size="large" {...control} aria-label="Large sizes">
        {children}
      </ToggleButtonGroup>
    </Stack>
  );
}
render(<ToggleButtonSizes />)`;

const colorsCode = `const ColorToggleButton = () => {
  const [alignment, setAlignment] = useState('web');

  const handleChange = (_event, newAlignment) => {
    setAlignment(newAlignment);
  };

  return (
    <Stack spacing={2} flexWrap="wrap">
      <Stack direction="column" spacing={2}>
        <ToggleButtonGroup
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="primary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="secondary"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="success"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
      <Stack direction="column" spacing={2}>
        <ToggleButtonGroup
          color="warning"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="info"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="error"
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          disabled
          value={alignment}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value="ios">iOS</ToggleButton>
          <ToggleButton value="web">Web</ToggleButton>
          <ToggleButton value="android">Android</ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Stack>
  );
}
render(<ColorToggleButton />)`;

const verticalButtonsCode = `const VerticalToggleButtons = () => {
  const [view, setView] = useState('list');

  const handleChange = (_event, nextView) => {
    setView(nextView);
  };

  return (
    <ToggleButtonGroup
      orientation="vertical"
      value={view}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton value="list" aria-label="list">
        <IconifyIcon icon="material-symbols:view-list-sharp" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="module" aria-label="module">
        <IconifyIcon icon="material-symbols:view-module-sharp" sx={{ fontSize: 24 }} />
      </ToggleButton>
      <ToggleButton value="quilt" aria-label="quilt">
        <IconifyIcon icon="material-symbols:view-quilt-sharp" sx={{ fontSize: 24 }} />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
render(<VerticalToggleButtons />)`;

const enforceValueSetCode = `const ToggleButtonNotEmpty = () => {
  const [alignment, setAlignment] = useState('left');
  const [devices, setDevices] = useState(() => ['phone']);

  const handleAlignment = (_event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);
    }
  };

  const handleDevices = (_event, newDevices) => {
    if (newDevices.length) {
      setDevices(newDevices);
    }
  };

  return (
    <Stack spacing={3} flexWrap="wrap">
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        <ToggleButton value="left" aria-label="left aligned">
          <IconifyIcon icon="material-symbols:format-align-left" sx={{ fontSize: 24 }} />
        </ToggleButton>
        <ToggleButton value="center" aria-label="centered">
          <IconifyIcon icon="material-symbols:format-align-center" sx={{ fontSize: 24 }} />
        </ToggleButton>
        <ToggleButton value="right" aria-label="right aligned">
          <IconifyIcon icon="material-symbols:format-align-right" sx={{ fontSize: 24 }} />
        </ToggleButton>
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={devices}
        onChange={handleDevices}
        aria-label="device"
      >
        <ToggleButton value="laptop" aria-label="laptop">
          <IconifyIcon icon="material-symbols:laptop-windows-outline" sx={{ fontSize: 24 }} />
        </ToggleButton>
        <ToggleButton value="tv" aria-label="tv">
          <IconifyIcon icon="material-symbols:tv-outline" sx={{ fontSize: 24 }} />
        </ToggleButton>
        <ToggleButton value="phone" aria-label="phone">
          <IconifyIcon icon="material-symbols:phone-android-outline" sx={{ fontSize: 24 }} />
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
render(<ToggleButtonNotEmpty />)`;

const standaloneToggleButtonCode = `const StandaloneToggleButton = () => {
  const [selected, setSelected] = useState(false);

  return (
    <Stack spacing={1}>
      <ToggleButton
        value="check"
        selected={selected}
        onChange={() => {
          setSelected(!selected);
        }}
      >
        <IconifyIcon icon="material-symbols:check" sx={{ fontSize: 24 }} />
      </ToggleButton>
    </Stack>
  );
}
render(<StandaloneToggleButton />)`;

const ToggleButtonDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Toggle Button',
        description: 'A Toggle Button can be used to group related options.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'ToggleButton',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-toggle-button`,
        folderLink: `${folderBaseLink}/ToggleButtonDoc.jsx`,
      }}
    >
      <DocSection
        title="Exclusive selection"
        description="With exclusive selection, selecting one option deselects any other."
      >
        <DocCard code={exclusiveSelectionCode} noInline />
      </DocSection>
      <DocSection
        title="Multiple selection"
        description="Multiple selection allows for logically-grouped options, like bold, italic, and underline, to have multiple options selected."
      >
        <DocCard code={multipleSelectionCode} noInline />
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
            For larger or smaller buttons, use the <Code>size</Code> prop. Default size is{' '}
            <Code>medium</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesCode} noInline />
      </DocSection>
      <DocSection title="Color">
        <DocCard code={colorsCode} noInline />
      </DocSection>
      <DocSection
        title="Vertical buttons"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The buttons can be stacked vertically with the <Code>orientation</Code> prop set to
            "vertical".
          </Typography>
        }
      >
        <DocCard code={verticalButtonsCode} noInline />
      </DocSection>
      <DocSection
        title="Enforce value set"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            If you want to enforce that at least one button must be active, you can adapt your{' '}
            <Code>handleChange</Code> function.
          </Typography>
        }
      >
        <DocCard code={enforceValueSetCode} noInline />
      </DocSection>
      <DocSection title="Standalone toggle button">
        <DocCard code={standaloneToggleButtonCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default ToggleButtonDoc;
