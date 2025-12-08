import { Button, Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicButtonGroupCode = `<ButtonGroup variant="contained" aria-label="Basic button group" >
  <Button>One</Button>
  <Button>Two</Button>
  <Button>Three</Button>
</ButtonGroup>`;

const buttonVariantsCode = `<Stack 
  direction="column" 
  spacing={1} 
  sx={{ alignItems: 'flex-start' }}
>
  <ButtonGroup variant="outlined" aria-label="Basic button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup variant="contained" aria-label="Basic button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup variant="soft" aria-label="Basic button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup variant="text" aria-label="Basic button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
</Stack>`;

const sizesAndColorsCode = `<Stack direction="column" spacing={2}>
  <ButtonGroup size="small" aria-label="Small button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup color="secondary" aria-label="Medium-sized button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup size="large" color="warning" aria-label="Large button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
</Stack>`;

const verticalGroupCode = `<Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
  <ButtonGroup orientation="vertical" aria-label="Vertical button group">
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup
    orientation="vertical"
    aria-label="Vertical button group"
    variant="contained"
  >
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup
    orientation="vertical"
    aria-label="Vertical button group"
    variant="soft"
  >
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
  <ButtonGroup
    orientation="vertical"
    aria-label="Vertical button group"
    variant="text"
  >
    <Button>One</Button>
    <Button>Two</Button>
    <Button>Three</Button>
  </ButtonGroup>
</Stack>`;

const splitButtonCode = `const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];

const SplitButton = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleClick = () => {
    console.info(\`You clicked \${options[selectedIndex]}\`);
  };

  const handleMenuItemClick = (_event, index) => {
    setSelectedIndex(index);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button onClick={handleClick}>{options[selectedIndex]}</Button>
        <Button
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <IconifyIcon 
            icon='material-symbols:arrow-drop-down' 
            sx={{ fontSize: 24 }} 
          />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      disabled={index === 2}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
}
render(<SplitButton />)`;

const disabledElevationCode = `<ButtonGroup
  disableElevation
  variant="contained"
  aria-label="Disabled button group"
>
  <Button>One</Button>
  <Button>Two</Button>
</ButtonGroup>`;

const loadingButtonCode = `<ButtonGroup 
  variant="outlined" 
  aria-label="Loading button group"
>
  <Button>Submit</Button>
  <Button>Fetch data</Button>
  <Button 
    loading 
    loadingPosition="start" 
    startIcon={
      <IconifyIcon 
        icon="material-symbols:save" 
        sx={{ fontSize: 20 }} 
      />
    }
  >
    Save
  </Button>
</ButtonGroup>`;

const ButtonGroupDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Button Group',
        description: 'The ButtonGroup component can be used to group related buttons.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'ButtonGroup',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-button-group`,
        folderLink: `${folderBaseLink}/ButtonGroupDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic button group"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The buttons can be grouped by wrapping them with the <Code>ButtonGroup</Code> component.
            They need to be immediate children.
          </Typography>
        }
      >
        <DocCard code={basicButtonGroupCode} />
      </DocSection>
      <DocSection
        title="Button variants"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            All the standard button variants are supported. Default is <Code>outlined</Code>.
          </Typography>
        }
      >
        <DocCard code={buttonVariantsCode} />
      </DocSection>
      <DocSection
        title="Sizes and colors"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The <Code>size</Code> and <Code>color</Code> props can be used to control the appearance
            of the button group. Default size is <Code>mediun</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesAndColorsCode} />
      </DocSection>
      <DocSection
        title="Vertical group"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The button group can be displayed vertically using the{' '}
            <Code>orientation="vertical"</Code> prop.
          </Typography>
        }
      >
        <DocCard code={verticalGroupCode} />
      </DocSection>
      <DocSection
        title="Split button"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            <Code>ButtonGroup</Code> can also be used to create a split button. The dropdown can
            change the button action or be used to immediately trigger a related action.
          </Typography>
        }
      >
        <DocCard code={splitButtonCode} noInline />
      </DocSection>
      <DocSection
        title="Disabled elevation"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can remove the elevation with the <Code>disableElevation</Code> prop.
          </Typography>
        }
      >
        <DocCard code={disabledElevationCode} />
      </DocSection>
      <DocSection
        title="Loading button"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the <Code>loading</Code> prop from <Code>Button</Code> to set buttons in a loading
            state and disable interactions.
          </Typography>
        }
      >
        <DocCard code={loadingButtonCode} scope={{ Button }} />
      </DocSection>
    </DocPageLayout>
  );
};

export default ButtonGroupDoc;
