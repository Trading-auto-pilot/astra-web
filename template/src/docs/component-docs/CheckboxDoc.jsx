import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { red } from 'theme/palette/colors';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicCheckboxesCode = `<Stack spacing={1}>
  <Checkbox defaultChecked />
  <Checkbox />
  <Checkbox disabled />
  <Checkbox disabled checked />
</Stack>`;

const labelCode = `<FormGroup>
  <FormControlLabel control={<Checkbox defaultChecked />} label="Label" />
  <FormControlLabel required control={<Checkbox />} label="Required" />
  <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
</FormGroup>`;

const sizesCode = `<div>
  <Checkbox defaultChecked size="small" />
  <Checkbox defaultChecked size="medium" />
  <Checkbox
    defaultChecked
    sx={{ [\`& .\${svgIconClasses.root}\`]: { fontSize: 24 } }}
  />
</div>`;

const colorCode = `<div>
  <Checkbox defaultChecked color="default" />
  <Checkbox defaultChecked />
  <Checkbox defaultChecked color="secondary" />
  <Checkbox defaultChecked color="info" />
  <Checkbox defaultChecked color="success" />
  <Checkbox defaultChecked color="warning" />
  <Checkbox defaultChecked color="error" />
  <Checkbox defaultChecked color="neutral" />
  <Checkbox
    defaultChecked
    sx={{
      color: red[800],
      [\`&.\${checkboxClasses.checked}\`]: {
        color: red[600],
      },
    }}
  />
</div>`;

const iconCode = `<div>
  <Checkbox 
    icon={
      <IconifyIcon 
        icon="material-symbols:favorite-outline" 
        sx={{ fontSize: 24 }} 
      />
    } 
    checkedIcon={
      <IconifyIcon 
        icon="material-symbols:favorite" 
        sx={{ fontSize: 24 }} 
      />
    } 
  />
  <Checkbox
    icon={
      <IconifyIcon 
        icon="material-symbols:bookmark-outline" 
        sx={{ fontSize: 24 }} 
      />
    }
    checkedIcon={
      <IconifyIcon 
        icon="material-symbols:bookmark" 
        sx={{ fontSize: 24 }} 
      />
    }
  />
</div>`;

const controlledCheckboxCode = `const ControlledCheckbox = () => {
  const [checked, setChecked] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Checkbox
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
render(<ControlledCheckbox />)`;

const indeterminateCode = `const IndeterminateCheckbox = () => {
  const [checked, setChecked] = useState([true, false]);

  const handleChange1 = (event) => {
    setChecked([event.target.checked, event.target.checked]);
  };

  const handleChange2 = (event) => {
    setChecked([event.target.checked, checked[1]]);
  };

  const handleChange3 = (event) => {
    setChecked([checked[0], event.target.checked]);
  };

  const children = (
    <Stack direction="column" sx={{ ml: 3 }}>
      <FormControlLabel
        label="Child 1"
        control={
          <Checkbox checked={checked[0]} onChange={handleChange2} />
        }
      />
      <FormControlLabel
        label="Child 2"
        control={
          <Checkbox checked={checked[1]} onChange={handleChange3} />
        }
      />
    </Stack>
  );

  return (
    <div>
      <FormControlLabel
        label="Parent"
        control={
          <Checkbox
            checked={checked[0] && checked[1]}
            indeterminate={checked[0] !== checked[1]}
            onChange={handleChange1}
          />
        }
      />
      {children}
    </div>
  );
}
render(<IndeterminateCheckbox />)`;

const formGroupCode = `const CheckboxesGroup = () => {
  const [state, setState] = useState({
    gilad: true,
    jason: false,
    antoine: false,
  });

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  const { gilad, jason, antoine } = state;
  const error = [gilad, jason, antoine].filter((v) => v).length !== 2;

  return (
    <Stack sx={{ flexWrap: 'wrap' }}>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormLabel component="legend">Assign responsibility</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
            }
            label="Gilad Gray"
          />
          <FormControlLabel
            control={
              <Checkbox checked={jason} onChange={handleChange} name="jason" />
            }
            label="Jason Killian"
          />
          <FormControlLabel
            control={
              <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
            }
            label="Antoine Llorca"
          />
        </FormGroup>
        <FormHelperText>Be careful</FormHelperText>
      </FormControl>
      <FormControl
        required
        error={error}
        component="fieldset"
        sx={{ m: 3 }}
        variant="standard"
      >
        <FormLabel component="legend">Pick two</FormLabel>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
            }
            label="Gilad Gray"
          />
          <FormControlLabel
            control={
              <Checkbox checked={jason} onChange={handleChange} name="jason" />
            }
            label="Jason Killian"
          />
          <FormControlLabel
            control={
              <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
            }
            label="Antoine Llorca"
          />
        </FormGroup>
        <FormHelperText>You can display an error</FormHelperText>
      </FormControl>
    </Stack>
  );
}
render(<CheckboxesGroup />)`;

const labelPlacementCode = `<FormControl component="fieldset">
  <FormLabel component="legend">Label placement</FormLabel>
  <FormGroup aria-label="position" row sx={{ gap: 3, mt: 1.5, ml: 1 }}>
    <FormControlLabel
      value="top"
      control={<Checkbox />}
      label="Top"
      labelPlacement="top"
    />
    <FormControlLabel
      value="start"
      control={<Checkbox />}
      label="Start"
      labelPlacement="start"
    />
    <FormControlLabel
      value="bottom"
      control={<Checkbox />}
      label="Bottom"
      labelPlacement="bottom"
    />
    <FormControlLabel
      value="end"
      control={<Checkbox />}
      label="End"
      labelPlacement="end"
    />
  </FormGroup>
</FormControl>`;

const CheckboxDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Checkbox',
        description: 'Checkboxes allow the user to select one or more items from a set.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Checkbox',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-checkbox`,
        folderLink: `${folderBaseLink}/CheckboxDoc.jsx`,
      }}
    >
      <DocSection title="Basic checkboxes">
        <DocCard code={basicCheckboxesCode} />
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
            You can provide a label to the <Code>Checkbox</Code> thanks to the{' '}
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
            Use the <Code>size</Code> prop or customize the font size of the svg icons to change the
            size of the checkboxes. Default size is <Code>small</Code>
          </Typography>
        }
      >
        <DocCard code={sizesCode} />
      </DocSection>
      <DocSection title="Color">
        <DocCard code={colorCode} scope={{ red }} />
      </DocSection>
      <DocSection title="Icon">
        <DocCard code={iconCode} />
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
            You can control the checkbox with the <Code>checked</Code> and <Code>onChange</Code>{' '}
            props:
          </Typography>
        }
      >
        <DocCard code={controlledCheckboxCode} noInline />
      </DocSection>
      <DocSection
        title="Indeterminate"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            A checkbox input can only have two states in a form: checked or unchecked. It either
            submits its value or doesn't. Visually, there are <strong>three</strong> states a
            checkbox can be in: checked, unchecked or indeterminate.
          </Typography>
        }
      >
        <DocCard code={indeterminateCode} noInline />
      </DocSection>
      <DocSection
        title="FormGroup"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            <Code>FormGroup</Code> is a helpful wrapper used to group selection control components.
          </Typography>
        }
      >
        <DocCard code={formGroupCode} noInline />
      </DocSection>
      <DocSection title="Label placement" description="You can change the placement of the label:">
        <DocCard code={labelPlacementCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default CheckboxDoc;
