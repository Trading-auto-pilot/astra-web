import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';
import StyledTextField from 'components/styled/StyledTextField';

const basicSelectCode = `const BasicSelect = () => {
  const [age, setAge] = useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ width: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
render(<BasicSelect />)`;

const customStyledSelectCode = `import StyledTextField from 'components/styled/StyledTextField';

const CustomStyledSelect = () => {
  const [age, setAge] = useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Stack spacing={2} alignItems="center">
      <StyledTextField
        id="custom-select-small"
        select
        size="small"
        label="Age"
        value={age}
        onChange={handleChange}
        sx={{
          width: 120,
        }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </StyledTextField>
      <StyledTextField
        id="custom-select-medium"
        select
        label="Age"
        value={age}
        onChange={handleChange}
        sx={{
          width: 120,
        }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </StyledTextField>
      <StyledTextField
        id="custom-select-large"
        select
        size="large"
        label="Age"
        value={age}
        onChange={handleChange}
        sx={{
          width: 120,
        }}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </StyledTextField>
    </Stack>
  );
}
render(<CustomStyledSelect />)`;

const sizesCode = `
const SizesSelect = () => {

  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid size={4}>
        <FormControl fullWidth size="small">
          <InputLabel>Age</InputLabel>
          <Select label="Age" value={age} size="small" onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            value={age}
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth size="large">
          <InputLabel>Age</InputLabel>
          <Select label="Age" value={age} size="large" onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid size={4}>
        <FormControl fullWidth size="small" variant="outlined">
          <InputLabel>Age</InputLabel>
          <Select label="Age" value={age} size="small" onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="demo-simple-select-label">Age</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            value={age}
            onChange={handleChange}
          >
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={4}>
        <FormControl fullWidth size="large" variant="outlined">
          <InputLabel>Age</InputLabel>
          <Select label="Age" value={age} size="large" onChange={handleChange}>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
render(<SizesSelect />)`.trim();

const filledAndStandardVariantsCode = `const SelectVariants = () => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-filled-label">Age</InputLabel>
        <Select
          label="Age"
          labelId="demo-simple-select-filled-label"
          id="demo-simple-select-filled"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-outlined-label">Age</InputLabel>
        <Select
          label="Age"
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={age}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
render(<SelectVariants />)`;

const labelsAndHelperTexCode = `const SelectLabels = () => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>With label + helper text</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={age}
          onChange={handleChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Without label</FormHelperText>
      </FormControl>
    </div>
  );
}
render(<SelectLabels />)`;

const autoWidthCode = `const SelectAutoWidth = () => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 80 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={handleChange}
          autoWidth
          label="Age"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={21}>Twenty one</MenuItem>
          <MenuItem value={22}>Twenty one and a half</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
render(<SelectAutoWidth />)`;

const smallSizeCode = `const SelectSmall = () => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Age</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={age}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
}
render(<SelectSmall />)`;

const otherPropsCode = `const SelectOtherProps = () => {
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }} disabled>
        <InputLabel id="demo-simple-select-disabled-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-disabled-label"
          id="demo-simple-select-disabled"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Disabled</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }} error>
        <InputLabel id="demo-simple-select-error-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-error-label"
          id="demo-simple-select-error"
          value={age}
          label="Age"
          onChange={handleChange}
          renderValue={(value) => \`⚠️  - \${value}\`}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Error</FormHelperText>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-readonly-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-readonly-label"
          id="demo-simple-select-readonly"
          value={age}
          label="Age"
          onChange={handleChange}
          inputProps={{ readOnly: true }}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Read only</FormHelperText>
      </FormControl>
      <FormControl required sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-required-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={age}
          label="Age *"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
    </div>
  );
}
render(<SelectOtherProps />)`;

const multipleSelectDefaultCode = `const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelectDefault = () => {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 1, maxWidth: 300 }}>
        <InputLabel id="demo-multiple-name-label">Name</InputLabel>
        <Select
          label="Name"
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={personName}
          onChange={handleChange}
          input={<FilledInput label="Name" />}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
render(<MultipleSelectDefault />)`;

const multipleSelectCheckmarksCode = `const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const MultipleSelectCheckmarks = () => {
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 1, maxWidth: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={personName}
          onChange={handleChange}
          input={<FilledInput label="Tag" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
render(<MultipleSelectCheckmarks />)`;

const multipleSelectChipCode = `const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelectChip = () => {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 1, maxWidth: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Chip</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<FilledInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Stack spacing={0.5} sx={{ flexWrap: 'wrap' mt:.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Stack>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
render(<MultipleSelectChip />)`;

const multipleSelectPlaceholderCode = `const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  slotProps: {
    paper: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const MultipleSelectPlaceholder = () => {
  const theme = useTheme();
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, mt: 3, width: 1, maxWidth: 300 }}>
        <Select
          multiple
          displayEmpty
          value={personName}
          onChange={handleChange}
          input={<FilledInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>Placeholder</em>;
            }

            return selected.join(', ');
          }}
          MenuProps={MenuProps}
          slotProps={{
            input: {
              'aria-label': 'Without label',
            },
          }}
        >
          <MenuItem disabled value="">
            <em>Placeholder</em>
          </MenuItem>
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
render(<MultipleSelectPlaceholder />)`;

const controllingOpenStateCode = `const ControlledOpenSelect = () => {
  const [age, setAge] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div>
      <Button sx={{ display: 'block', mt: 2 }} onClick={handleOpen}>
        Open the select
      </Button>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="demo-controlled-open-select-label">Age</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
render(<ControlledOpenSelect />)`;

const withDialogCode = `const DialogSelect = () => {
  const [open, setOpen] = useState(false);
  const [age, setAge] = useState('');

  const handleChange = (event) => {
    setAge(Number(event.target.value) || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  return (
    <div>
      <Button onClick={handleClickOpen}>Open select dialog</Button>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Fill the form</DialogTitle>
        <DialogContent>
          <Stack component="form" sx={{ flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel htmlFor="demo-dialog-native">Age</InputLabel>
              <Select
                native
                value={age}
                onChange={handleChange}
                input={<FilledInput label="Age" id="demo-dialog-native" />}
              >
                <option aria-label="None" value="" />
                <option value={10}>Ten</option>
                <option value={20}>Twenty</option>
                <option value={30}>Thirty</option>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">Age</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={age}
                onChange={handleChange}
                input={<FilledInput label="Age" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
render(<DialogSelect />)`;

const groupingCode = `<FormControl sx={{ m: 1, minWidth: 120 }}>
  <InputLabel htmlFor="grouped-select">Grouping</InputLabel>
  <Select defaultValue="" id="grouped-select" label="Grouping">
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <ListSubheader>Category 1</ListSubheader>
    <MenuItem value={1}>Option 1</MenuItem>
    <MenuItem value={2}>Option 2</MenuItem>
    <ListSubheader>Category 2</ListSubheader>
    <MenuItem value={3}>Option 3</MenuItem>
    <MenuItem value={4}>Option 4</MenuItem>
  </Select>
</FormControl>`;

const SelectDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Select',
        description:
          'Select components are used for collecting user provided information from a list of options.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Select',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-select`,
        folderLink: `${folderBaseLink}/SelectDoc.jsx`,
      }}
    >
      <DocSection title="Basic Select">
        <DocCard code={basicSelectCode} noInline scope={{ StyledTextField }} />
      </DocSection>
      <DocSection title="Custom Styled Select">
        <DocCard code={customStyledSelectCode} noInline scope={{ StyledTextField }} />
      </DocSection>
      <DocSection
        title="Sizes"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 3,
            }}
          >
            For larger or smaller select, use the <Code>size</Code> prop. Default is{' '}
            <Code>medium</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesCode} noInline />
      </DocSection>
      <DocSection title="Props">
        <DocNestedSection title="Variants" id={kebabCase('Variants')}>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            There are three variants to choose from: filled (default), outlined and standard.
          </Typography>
          <DocCard code={filledAndStandardVariantsCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Labels and helper text" id={kebabCase('Labels and helper text')}>
          <DocCard code={labelsAndHelperTexCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Auto width" id={kebabCase('Auto width')}>
          <DocCard code={autoWidthCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Small size" id={kebabCase('Small size')}>
          <DocCard code={smallSizeCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Other props" id={kebabCase('Other props')}>
          <DocCard code={otherPropsCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Multiple select"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 2,
            }}
          >
            The <Code>Select</Code> component can handle multiple selections. It's enabled with the{' '}
            <Code>multiple</Code> prop.
          </Typography>
        }
      >
        <DocNestedSection title="Default" id={kebabCase('Default')}>
          <DocCard code={multipleSelectDefaultCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Checkmarks" id={kebabCase('Checkmarks')}>
          <DocCard code={multipleSelectCheckmarksCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Chip" id={kebabCase('Chip')}>
          <DocCard code={multipleSelectChipCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Placeholder" id={kebabCase('Placeholder')}>
          <DocCard code={multipleSelectPlaceholderCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Controlling the open state"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can control the open state of the select with the <Code>open</Code> prop.
            Alternatively, it is also possible to set the initial(uncontrolled) open state of the
            component with the <Code>defaultOpen</Code> prop.
          </Typography>
        }
      >
        <DocCard code={controllingOpenStateCode} noInline />
      </DocSection>
      <DocSection
        title="With a dialog"
        description="While it's discouraged by the Material Design guidelines, you can use a select inside a dialog."
      >
        <DocCard code={withDialogCode} noInline />
      </DocSection>
      <DocSection
        title="Grouping"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Display categories with the <Code>ListSubheader</Code> component.
          </Typography>
        }
      >
        <DocCard code={groupingCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default SelectDoc;
