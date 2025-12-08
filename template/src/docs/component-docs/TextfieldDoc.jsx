import { Grid, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import IconifyIcon from 'components/base/IconifyIcon';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';
import StyledTextField from 'components/styled/StyledTextField';

const basicTextFieldCode = `<Box
  component="form"
  sx={{
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(8, 1fr)' },
    gap: 2,
    '& > :not(style)': { gridColumn: 'span 4' },
  }}
  noValidate
  autoComplete="off"
>
  <TextField id="outlined-basic" label="Outlined" variant="outlined" />
  <TextField id="filled-basic" label="Filled" variant="filled" />
</Box>`;

const customTextFieldCode = `<Box
  component="form"
  sx={{
    display: 'grid',
    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(12, 1fr)' },
    gap: 2,
    '& > :not(style)': { gridColumn: 'span 4' },
  }}
  noValidate
  autoComplete="off"
>
  <StyledTextField id="custom-small" label="Custom small" size="small" />
  <StyledTextField id="custom-medium" label="Custom medium" />
  <StyledTextField id="custom-large" label="Custom large" size="large" />
</Box>`;

const formPropsCode = `<Box
  component="form"
  sx={{
    display: 'grid',
		gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(12, 1fr)' },
		gap: 2,
    '& > :not(style)': { gridColumn: 'span 4', },
  }}
  noValidate
  autoComplete="off"
>
  <TextField
    required
    id="outlined-required"
    label="Required"
    defaultValue="Hello World"
    variant="outlined"
  />
  <TextField
    disabled
    id="outlined-disabled"
    label="Disabled"
    defaultValue="Hello World"
    variant="outlined"
  />
  <TextField
    id="outlined-password-input"
    label="Password"
    type="password"
    autoComplete="current-password"
    variant="outlined"
  />
  <TextField
    id="outlined-read-only-input"
    label="Read Only"
    defaultValue="Hello World"
    slotProps={{
      input: {
        readOnly: true,
      }
    }}
    variant="outlined"
  />
  <TextField
    id="outlined-number"
    label="Number"
    type="number"
    slotProps={{
      inputLabel: {
        shrink: true,
      },
    }}
    variant="outlined"
  />
  <TextField 
    id="outlined-search" 
    label="Search field" 
    type="search" 
    variant="outlined" 
  />
  <TextField
    id="outlined-helperText"
    label="Helper text"
    defaultValue="Default Value"
    helperText="Some important text"
    variant="outlined"
  />
  <div></div>
  <div></div>
  <TextField
    required
    id="filled-required"
    label="Required"
    defaultValue="Hello World"
    variant="filled"
  />
  <TextField
    disabled
    id="filled-disabled"
    label="Disabled"
    defaultValue="Hello World"
    variant="filled"
  />
  <TextField
    id="filled-password-input"
    label="Password"
    type="password"
    autoComplete="current-password"
    variant="filled"
  />
  <TextField
    id="filled-read-only-input"
    label="Read Only"
    defaultValue="Hello World"
    slotProps={{
      input: {
        readOnly: true,
      },
    }}
    variant="filled"
  />
  <TextField
    id="filled-number"
    label="Number"
    type="number"
    slotProps={{
      inputLabel: {
        shrink: true,
      },
    }}
    variant="filled"
  />
  <TextField
    id="filled-search"
    label="Search field"
    type="search"
    variant="filled"
  />
  <TextField
    id="filled-helperText"
    label="Helper text"
    defaultValue="Default Value"
    helperText="Some important text"
    variant="filled"
  />
</Box>`;

const validationCode = `<Box
  component="form"
  sx={{
    display: 'grid',
		gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(12, 1fr)' },
		gap: 2,
    '& > :not(style)': { gridColumn: 'span 6', },
  }}
  noValidate
  autoComplete="off"
>
  <TextField
    error
    id="outlined-error"
    label="Error"
    defaultValue="Hello World"
    variant="outlined"
  />
  <TextField
    error
    id="outlined-error-helper-text"
    label="Error"
    defaultValue="Hello World"
    helperText="Incorrect entry."
    variant="outlined"
  />
  <TextField
    error
    id="filled-error"
    label="Error"
    defaultValue="Hello World"
    variant="filled"
  />
  <TextField
    error
    id="filled-error-helper-text"
    label="Error"
    defaultValue="Hello World"
    helperText="Incorrect entry."
    variant="filled"
  />
</Box>`;

const multilineCode = `<Box
  component="form"
  sx={{
    display: 'grid',
		gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(12, 1fr)' },
		gap: 2,
    '& > :not(style)': { gridColumn: 'span 4', },
  }}
  noValidate
  autoComplete="off"
>
  <TextField
    id="outlined-multiline-flexible"
    label="Multiline"
    multiline
    minRows={2}
    maxRows={4}
    variant="outlined"
  />
  <TextField
    id="outlined-textarea"
    label="Multiline Placeholder"
    placeholder="Placeholder"
    multiline
    rows={2}
    variant="outlined"
  />
  <TextField
    id="outlined-multiline-static"
    label="Multiline"
    multiline
    rows={4}
    defaultValue="Default Value"
    variant="outlined"
  />
  <TextField
    id="filled-multiline-flexible"
    label="Multiline"
    multiline
    minRows={2}
    maxRows={4}
    variant="filled"
  />
  <TextField
    id="filled-textarea"
    label="Multiline Placeholder"
    placeholder="Placeholder"
    multiline
    rows={2}
    variant="filled"
  />
  <TextField
    id="filled-multiline-static"
    label="Multiline"
    multiline
    rows={4}
    defaultValue="Default Value"
    variant="filled"
  />
</Box>`;

const inputAdornmentsCode = `const InputAdornments = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Stack spacing={3} sx={{ flexWrap: 'wrap' }}>
      <Box sx={{  
        width: 1,
        display: 'grid',
		    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
		    gap: 2,
      }}>
        <TextField
          label="With normal TextField"
          id="outlined-start-adornment"
          sx={{ width: 1, maxWidth: '30ch' }}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">kg</InputAdornment>,
            }
          }}
        />
        <FormControl sx={{ width: 1, maxWidth: '30ch' }} variant="outlined">
          <OutlinedInput
            id="outlined-adornment-weight"
            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
          <FormHelperText id="outlined-weight-helper-text">Weight</FormHelperText>
        </FormControl>
        <FormControl sx={{ width: 1, maxWidth: '30ch' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <IconifyIcon icon="material-symbols:visibility-off" sx={{ fontSize: 24 }} /> : <IconifyIcon icon="material-symbols:visibility" sx={{ fontSize: 24 }} />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <FormControl variant="outlined" fullWidth sx={{ width: 1, maxWidth: '30ch' }}>
          <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            label="Amount"
          />
        </FormControl>
      </Box>
      <Box sx={{  
        width: 1,
        display: 'grid',
		    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
		    gap: 2,
      }}>
        <TextField
          label="With normal TextField"
          id="filled-start-adornment"
          sx={{ width: 1, maxWidth: '30ch' }}
          slotProps={{
            input:{
              startAdornment: <InputAdornment position="start">kg</InputAdornment>,
            }
          }}
          variant="filled"
        />
        <FormControl sx={{ width: 1, maxWidth: '30ch' }} variant="filled">
          <FilledInput
            id="filled-adornment-weight"
            endAdornment={<InputAdornment position="end">kg</InputAdornment>}
            aria-describedby="filled-weight-helper-text"
            inputProps={{
              'aria-label': 'weight',
            }}
          />
          <FormHelperText id="filled-weight-helper-text">Weight</FormHelperText>
        </FormControl>
        <FormControl sx={{ width: 1, maxWidth: '30ch' }} variant="filled">
          <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
          <FilledInput
            id="filled-adornment-password"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <IconifyIcon icon="material-symbols:visibility-off" sx={{ fontSize: 24 }} /> : <IconifyIcon icon="material-symbols:visibility" sx={{ fontSize: 24 }} />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
        <FormControl fullWidth sx={{ width: 1, maxWidth: '30ch' }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Amount</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
      </Box>
    </Stack>
  );
}
render(<InputAdornments />)`;

const sizesCode = `<Box
  component="form"
  sx={{
    display: 'grid',
		gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(12, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(12, 1fr)' },
		gap: 2,
    '& > :not(style)': { gridColumn: 'span 4', },
  }}
  noValidate
  autoComplete="off"
>
  <TextField
    label="Size"
    id="outlined-size-small"
    defaultValue="Small"
    size="small"
    variant="outlined"
  />
  <TextField label="Size" size='medium' id="outlined-size-normal" defaultValue="Medium" variant="outlined"/>
  <TextField
    label="Size"
    id="outlined-size-large"
    defaultValue="Large"
    size="large"
    variant="outlined"
  />
  <TextField
    label="Size"
    id="filled-size-small"
    defaultValue="Small"
    variant="filled"
    size="small"
  />
  <TextField
    label="Size"
    id="filled-size-normal"
    defaultValue="Medium"
    variant="filled"
  />
  <TextField
    label="Size"
    size='large'
    id="filled-size-normal"
    defaultValue="Normal"
    variant="filled"
  />
</Box>`;

const fullWidthCode = `<Stack
  direction="column"
  spacing={2}
  sx={{ width: 600, maxWidth: 1, mx: 'auto' }}
>
  <TextField id="fullWidth" variant="outlined" label="fullWidth" fullWidth />
	<TextField id="fullWidth" variant="filled" label="fullWidth" fullWidth />
</Stack>`;

const uncontrolledVsControlledCode = `const StateTextFields = () => {
  const [name, setName] = useState('Cat in the Hat');

  return (
    <Stack
      component="form"
      direction="column"
      spacing={2}
      sx={{
        '& > :not(style)': { width: 1, maxWidth: '30ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-controlled"
        label="Controlled"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <TextField
        id="outlined-uncontrolled"
        label="Uncontrolled"
        defaultValue="foo"
      />
    </Stack>
  );
}
render(<StateTextFields />)`;

const colorsCode = `<Box
  component="form"
  sx={{
    display: 'grid',
		gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(8, 1fr)'},
		gap: 2,
    '& > :not(style)': { gridColumn: 'span 4', },
  }}
  noValidate
  autoComplete="off"
>
  <TextField label="Outlined secondary" color="secondary" variant="outlined" focused />
  <TextField label="Filled success" variant="filled" color="success" focused />
</Box>`;

const TextFieldDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Text Field',
        description: 'Text Fields let users enter and edit text.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Text Field',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-text-field`,
        folderLink: `${folderBaseLink}/TextFieldDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Text Field"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>Text Field</Code> wrapper component is a complete form control including a
            label, input, and help text. It comes with three variants: outlined, filled (default),
            and standard.
          </Typography>
        }
      >
        <DocCard code={basicTextFieldCode} />
      </DocSection>
      <DocSection title="Custom Text Field">
        <DocCard code={customTextFieldCode} scope={{ StyledTextField }} />
      </DocSection>
      <DocSection
        title="Form props"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Standard form attributes are supported, for example <Code>required</Code>,{' '}
            <Code>disabled</Code>, <Code>type</Code>, etc. as well as a <Code>helperText</Code>{' '}
            which is used to give context about a field's input, such as how the input will be used.
          </Typography>
        }
      >
        <DocCard code={formPropsCode} />
      </DocSection>
      <DocSection
        title="Validation"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>error</Code> prop toggles the error state. The <Code>helperText</Code> prop
            can then be used to provide feedback to the user about the error.
          </Typography>
        }
      >
        <DocCard code={validationCode} />
      </DocSection>
      <DocSection
        title="Multiline"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>multiline</Code> prop transforms the text field into a{' '}
            <Link href={`${muiComponentBaseLink}/react-textarea-autosize`}>TextareaAutosize</Link>{' '}
            element.
          </Typography>
        }
      >
        <DocCard code={multilineCode} />
      </DocSection>
      <DocSection
        title="Input Adornments"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The main way is with an <Code>InputAdornment</Code>. This can be used to add a prefix, a
            suffix, or an action to an input.
          </Typography>
        }
      >
        <DocCard code={inputAdornmentsCode} noInline sx={{ mb: 4 }} />
      </DocSection>
      <DocSection
        title="Sizes"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Fancy smaller inputs? Use the <Code>size</Code> prop. Default is <Code>medium</Code>.
          </Typography>
        }
      >
        <Grid container sx={{ mb: 2 }} spacing={2}>
          <Grid size={4}>
            <TextField
              label="Size small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              label="Size medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="medium"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              label="Size large"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              size="large"
              fullWidth
            />
          </Grid>

          <Grid size={4}>
            <TextField
              label="Size small"
              value="Size small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              label="Size medium"
              value="Size medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="medium"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              label="Size large"
              value="Size large"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              size="large"
              fullWidth
            />
          </Grid>

          <Grid size={4}>
            <TextField label="Size small" fullWidth size="small" />
          </Grid>
          <Grid size={4}>
            <TextField label="Size medium" fullWidth size="medium" />
          </Grid>
          <Grid size={4}>
            <TextField label="Size large" size="large" fullWidth />
          </Grid>

          <Grid size={4}>
            <TextField label="Size small" fullWidth size="small" value="Size small" />
          </Grid>
          <Grid size={4}>
            <TextField label="Size medium" fullWidth size="medium" value="Size medium" />
          </Grid>
          <Grid size={4}>
            <TextField label="Size large" size="large" fullWidth value="Size large" />
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 2 }} spacing={2}>
          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="medium"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size large"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              size="large"
              fullWidth
            />
          </Grid>

          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size small"
              value="Size small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size medium"
              value="Size medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="medium"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size large"
              value="Size large"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              size="large"
              fullWidth
            />
          </Grid>

          <Grid size={4}>
            <TextField variant="outlined" label="Size small" fullWidth size="small" />
          </Grid>
          <Grid size={4}>
            <TextField variant="outlined" label="Size medium" fullWidth size="medium" />
          </Grid>
          <Grid size={4}>
            <TextField variant="outlined" label="Size large" size="large" fullWidth />
          </Grid>

          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size small"
              fullWidth
              size="small"
              value="Size small"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size medium"
              fullWidth
              size="medium"
              value="Size medium"
            />
          </Grid>
          <Grid size={4}>
            <TextField
              variant="outlined"
              label="Size large"
              size="large"
              fullWidth
              value="Size large"
            />
          </Grid>
        </Grid>

        <Grid container sx={{ mb: 2 }} spacing={2}>
          <Grid size={4}>
            <StyledTextField
              label="Size small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={4}>
            <StyledTextField
              label="Size medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="medium"
            />
          </Grid>
          <Grid size={4}>
            <StyledTextField
              label="Size large"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              size="large"
              fullWidth
            />
          </Grid>

          <Grid size={4}>
            <StyledTextField
              label="Size small"
              value="Size small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={4}>
            <StyledTextField
              label="Size medium"
              value="Size medium"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              fullWidth
              size="medium"
            />
          </Grid>
          <Grid size={4}>
            <StyledTextField
              label="Size large"
              value="Size large"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconifyIcon icon="material-symbols:calendar-today-outline" />
                    </InputAdornment>
                  ),
                },
              }}
              size="large"
              fullWidth
            />
          </Grid>

          <Grid size={4}>
            <StyledTextField label="Size small" fullWidth size="small" />
          </Grid>
          <Grid size={4}>
            <StyledTextField label="Size medium" fullWidth size="medium" />
          </Grid>
          <Grid size={4}>
            <StyledTextField label="Size large" size="large" fullWidth />
          </Grid>

          <Grid size={4}>
            <StyledTextField label="Size small" fullWidth size="small" value="Size small" />
          </Grid>
          <Grid size={4}>
            <StyledTextField label="Size medium" fullWidth size="medium" value="Size medium" />
          </Grid>
          <Grid size={4}>
            <StyledTextField label="Size large" size="large" fullWidth value="Size large" />
          </Grid>
        </Grid>
        <DocCard code={sizesCode} />
      </DocSection>
      <DocSection
        title="Full width"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            <Code>fullWidth</Code> can be used to make the input take up the full width of its
            container.
          </Typography>
        }
      >
        <DocCard code={fullWidthCode} />
      </DocSection>
      <DocSection
        title="Uncontrolled vs. Controlled"
        description="The component can be controlled or uncontrolled."
      >
        <DocCard code={uncontrolledVsControlledCode} noInline />
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
            The <Code>color</Code> prop changes the highlight color of the text field when focused.
          </Typography>
        }
      >
        <DocCard code={colorsCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default TextFieldDoc;
