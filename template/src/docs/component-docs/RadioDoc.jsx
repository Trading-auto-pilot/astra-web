import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicRadioCode = `<FormControl>
  <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="female"
    name="radio-buttons-group"
  >
    <FormControlLabel value="female" control={<Radio />} label="Female" />
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="other" control={<Radio />} label="Other" />
  </RadioGroup>
</FormControl>`;

const directionRadioCode = `<FormControl>
  <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
  <RadioGroup
    row
    aria-labelledby="demo-row-radio-buttons-group-label"
    name="row-radio-buttons-group"
  >
    <FormControlLabel value="female" control={<Radio />} label="Female" />
    <FormControlLabel value="male" control={<Radio />} label="Male" />
    <FormControlLabel value="other" control={<Radio checked />} disabled label="Other"  />
    <FormControlLabel
      value="disabled"
      disabled
      control={<Radio />}
      label="Other"
    />
  </RadioGroup>
</FormControl>`;

const controlledRadioCode = `const ControlledRadioButtonsGroup = () => {
  const [value, setValue] = useState('female');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">Gender</FormLabel>
      <RadioGroup
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={handleChange}
      >
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
      </RadioGroup>
    </FormControl>
  );
}
render(<ControlledRadioButtonsGroup />)`;

const standaloneRadioButtonsGroupCode = `const StandaloneRadioButtons = () => {
  const [selectedValue, setSelectedValue] = useState('a');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <Radio
        checked={selectedValue === 'a'}
        onChange={handleChange}
        value="a"
        name="radio-buttons"
        slotProps={{
          input: {
            'aria-labelledby': 'A',
          },
        }}
      />
      <Radio
        checked={selectedValue === 'b'}
        onChange={handleChange}
        value="b"
        name="radio-buttons"
        slotProps={{
          input: {
            'aria-labelledby': 'B',
          },
        }}
      />
    </div>
  );
}
render(<StandaloneRadioButtons />)`;

const sizesCode = `const SizeRadioButtons = () => {
  const [selectedValue, setSelectedValue] = useState('a');
  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: 'size-radio-button-demo',
    slotProps: { input: { 'aria-label': item } },
  });

  return (
    <div>
      <Radio {...controlProps('a')} size="small" />
      <Radio {...controlProps('b')} size="medium" />
      <Radio {...controlProps('c')} size="large" />
      <Radio
        {...controlProps('d')}
        sx={{
          [\`& .\${svgIconClasses.root}\`]: {
            fontSize: 30,
          },
        }}
      />
    </div>
  );
}
render(<SizeRadioButtons />)`;

const colorCode = `<FormControl>
  <FormLabel id="demo-radio-buttons-group-label">Colors</FormLabel>
  <RadioGroup
    aria-labelledby="demo-radio-buttons-group-label"
    defaultValue="primary"
    name="radio-buttons-group"
  >
    <FormControlLabel value="primary" control={<Radio color="primary" />} label="Primary" />
    <FormControlLabel value="secondary" control={<Radio color="secondary" />} label="Secondary" />
    <FormControlLabel value="info" control={<Radio color="info" />} label="Info" />
    <FormControlLabel value="success" control={<Radio color="success" />} label="Success" />
    <FormControlLabel value="warning" control={<Radio color="warning" />} label="Warning" />
    <FormControlLabel value="error" control={<Radio color="error" />} label="Error" />
    <FormControlLabel value="neutral" control={<Radio color="neutral" />} label="Neutral" />
  </RadioGroup>
</FormControl>`;

const labelPlacementCode = `<FormControl sx={{ gap: 1 }}>
  <FormLabel id="demo-form-control-label-placement">Label placement</FormLabel>
  <RadioGroup
    row
    aria-labelledby="demo-form-control-label-placement"
    name="position"
    defaultValue="top"
    sx={{ gap: 3, mt: 1, ml: 1 }}
  >
    <FormControlLabel
      value="top"
      control={<Radio />}
      label="Top"
      labelPlacement="top"
    />
    <FormControlLabel
      value="start"
      control={<Radio />}
      label="Start"
      labelPlacement="start"
    />
    <FormControlLabel
      value="bottom"
      control={<Radio />}
      label="Bottom"
      labelPlacement="bottom"
    />
    <FormControlLabel value="end" control={<Radio />} label="End" />
  </RadioGroup>
</FormControl>`;

const showErrorCode = `const ErrorRadios = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('Choose wisely');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === 'best') {
      setHelperText('You got it!');
      setError(false);
    } else if (value === 'worst') {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    } else {
      setHelperText('Please select an option.');
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl sx={{ m: 3 }} error={error} variant="standard">
        <FormLabel id="demo-error-radios">Pop quiz: MUI is...</FormLabel>
        <RadioGroup
          aria-labelledby="demo-error-radios"
          name="quiz"
          value={value}
          onChange={handleRadioChange}
        >
          <FormControlLabel value="best" control={<Radio />} label="The best!" />
          <FormControlLabel value="worst" control={<Radio />} label="The worst." />
        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
          Check Answer
        </Button>
      </FormControl>
    </form>
  );
}
render(<ErrorRadios />)`;

const RadioDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Radio Group',
        description: 'The Radio Group allows the user to select one option from a set.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Radio',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-radio-button`,
        folderLink: `${folderBaseLink}/RadioDoc.jsx`,
      }}
    >
      <DocSection
        title="Radio group"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            <Code>RadioGroup</Code> is a helpful wrapper used to group <Code>Radio</Code> components
            that provides an easier API, and proper keyboard accessibility to the group.
          </Typography>
        }
      >
        <DocCard code={basicRadioCode} sx={{ mb: 4 }} />

        <DocNestedSection title="Direction" id={kebabCase('Direction')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            To lay out the buttons horizontally, set the <Code>row</Code> prop:
          </Typography>
          <DocCard code={directionRadioCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Controlled" id={kebabCase('Controlled')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can control the radio with the <Code>value</Code> and <Code>onChange</Code> props:
          </Typography>
          <DocCard code={controlledRadioCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>

      <DocSection
        title="Standalone radio buttons"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            <Code>Radio</Code> can also be used standalone, without RadioGroup wrapper.
          </Typography>
        }
      >
        <DocCard code={standaloneRadioButtonsGroupCode} noInline />
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
            size of the radios. Default is <Code>small</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesCode} noInline />
      </DocSection>
      <DocSection title="Color">
        <DocCard code={colorCode} />
      </DocSection>
      <DocSection
        title="Label placement"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can change the placement of the label with the <Code>FormControlLabel</Code>{' '}
            component's <Code>labelPlacement</Code> prop:
          </Typography>
        }
      >
        <DocCard code={labelPlacementCode} />
      </DocSection>
      <DocSection
        title="Show error"
        description="In general, radio buttons should have a value selected by default. If that is not the case, you can display an error if no value is selected when the form is submitted:"
      >
        <DocCard code={showErrorCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default RadioDoc;
