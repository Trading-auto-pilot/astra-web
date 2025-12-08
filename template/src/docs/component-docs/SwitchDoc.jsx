import { Link, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicSwitchesCode = `<Stack spacing={1}>
  <Switch defaultChecked />
  <Switch />
  <Switch disabled defaultChecked />
  <Switch disabled />
</Stack>`;

const labelCode = `<FormGroup sx={{ gap: 1 }}>
  <FormControlLabel control={<Switch defaultChecked />} label="Label" sx={{ gap: 1 }} />
  <FormControlLabel required control={<Switch />} label="Required" sx={{ gap: 1 }} />
  <FormControlLabel disabled control={<Switch />} label="Disabled" sx={{ gap: 1 }} />
</FormGroup>`;

const sizesCode = `<Stack spacing={1} sx={{ justifyContent: 'center' }}>
  <Switch defaultChecked size="small" />
  <Switch defaultChecked />
</Stack>`;

const colorsCode = `<Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
  <Switch defaultChecked />
  <Switch defaultChecked color="secondary" />
  <Switch defaultChecked color="info" />
  <Switch defaultChecked color="success" />
  <Switch defaultChecked color="warning" />
  <Switch defaultChecked color="error" />
  <Switch defaultChecked color="default" />
  <Switch defaultChecked color="neutral" />
</Stack>`;

const controlledSwitchCode = `const ControlledSwitches = () => {
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      slotProps={{
        input: {
          'aria-label': 'controlled',
        },
      }}
    />
  );
}
render(<ControlledSwitches />)`;

const switchesWithFormgroupCode = `const SwitchesGroup = () => {
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: true,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <FormControl component="fieldset" variant="standard" sx={{ gap: 1 }}>
      <FormLabel component="legend">Assign responsibility</FormLabel>
      <FormGroup sx={{ gap: 1, mt: 1, ml: 1 }}>
        <FormControlLabel
          control={
            <Switch checked={state.gilad} onChange={handleChange} name="gilad" />
          }
          label="Gilad Gray"
          sx={{ gap: 1 }}
        />
        <FormControlLabel
          control={
            <Switch checked={state.jason} onChange={handleChange} name="jason" />
          }
          label="Jason Killian"
          sx={{ gap: 1 }}
        />
        <FormControlLabel
          control={
            <Switch checked={state.antoine} onChange={handleChange} name="antoine" />
          }
          label="Antoine Llorca"
          sx={{ gap: 1 }}
        />
      </FormGroup>
      <FormHelperText>Be careful</FormHelperText>
    </FormControl>
  );
}
render(<SwitchesGroup />)`;

const labelPlacementCode = `<FormControl component="fieldset" sx={{
  mx: 'auto',
  gap: 2,
}}>
  <FormLabel component="legend">Label placement</FormLabel>
  <FormGroup aria-label="position" row sx={{ gap: 4, mt: 1 }}>
    <FormControlLabel
      value="top"
      control={<Switch color="primary" />}
      label="Top"
      labelPlacement="top"
      sx={{ gap: 1, mx: 0, }} 
    />
    <FormControlLabel
      value="start"
      control={<Switch color="primary" />}
      label="Start"
      labelPlacement="start"
      sx={{ gap: 1, mx: 0, }} 
    />
    <FormControlLabel
      value="bottom"
      control={<Switch color="primary" />}
      label="Bottom"
      labelPlacement="bottom"
      sx={{ gap: 1, mx: 0, }} 
    />
    <FormControlLabel
      value="end"
      control={<Switch color="primary" />}
      label="End"
      labelPlacement="end"
      sx={{ gap: 1, mx: 0, }} 
    />
  </FormGroup>
</FormControl>`;

const SwitchDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Switch',
        description: 'Switches toggle the state of a single setting on or off.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Switch',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-switch`,
        folderLink: `${folderBaseLink}/SwitchDoc.jsx`,
      }}
    >
      <DocSection title="Basic switches">
        <DocCard code={basicSwitchesCode} />
      </DocSection>
      <DocSection
        title="Label"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can provide a label to the <Code>Switch</Code> thanks to the{' '}
            <Code>FormControlLabel</Code> component.
          </Typography>
        }
      >
        <DocCard code={labelCode} />
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
            Use the <Code>size</Code> prop to change the size of the switch. Default is{' '}
            <Code>medium</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesCode} />
      </DocSection>
      <DocSection title="Color">
        <DocCard code={colorsCode} />
      </DocSection>
      <DocSection
        title="Controlled"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can control the switch with the <Code>checked</Code> and <Code>onChange</Code>{' '}
            props:
          </Typography>
        }
      >
        <DocCard code={controlledSwitchCode} noInline />
      </DocSection>
      <DocSection
        title="Switches with FormGroup"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              <Code>FormGroup</Code> is a helpful wrapper used to group selection controls
              components that provides an easier API.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              However, you are encouraged to use{' '}
              <Link href="/component-docs/checkbox">Checkboxes</Link> instead if multiple related
              controls are required.
            </Typography>
          </>
        }
      >
        <DocCard code={switchesWithFormgroupCode} noInline />
      </DocSection>
      <DocSection title="Label placement" description="You can change the placement of the label:">
        <DocCard code={labelPlacementCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default SwitchDoc;
