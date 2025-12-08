import { Box, Typography } from '@mui/material';
import { initialConfig } from 'config';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const avatar = (index) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;

const basicChipCode = `<Stack direction="column" spacing={1}>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip label="Neutral" color="neutral" />
    <Chip label="Primary" color="primary" />
    <Chip label="Secondary" color="secondary" />
    <Chip label="Success" color="success" />
    <Chip label="Error" color="error" />
    <Chip label="Warning" color="warning" />
    <Chip label="Info" color="info" />
  </Stack>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip label="Neutral" color="neutral" variant="outlined" />
    <Chip label="Primary" color="primary" variant="outlined" />
    <Chip label="Secondary" color="secondary" variant="outlined" />
    <Chip label="Success" color="success" variant="outlined" />
    <Chip label="Error" color="error" variant="outlined" />
    <Chip label="Warning" color="warning" variant="outlined" />
    <Chip label="Info" color="info" variant="outlined" />
  </Stack>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip label="Neutral" color="neutral" variant="filled" />
    <Chip label="Primary" color="primary" variant="filled" />
    <Chip label="Secondary" color="secondary" variant="filled" />
    <Chip label="Success" color="success" variant="filled" />
    <Chip label="Error" color="error" variant="filled" />
    <Chip label="Warning" color="warning" variant="filled" />
    <Chip label="Info" color="info" variant="filled" />
  </Stack>
</Stack>`;

const clickableChipCode = `const ClickableChips = () => {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Neutral" color="neutral" onClick={handleClick} />
        <Chip label="Primary" color="primary" onClick={handleClick} />
        <Chip label="Secondary" color="secondary" onClick={handleClick} />
        <Chip label="Success" color="success" onClick={handleClick} />
        <Chip label="Error" color="error" onClick={handleClick} />
        <Chip label="Warning" color="warning" onClick={handleClick} />
        <Chip label="Info" color="info" onClick={handleClick} />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Neutral" color="neutral" onClick={handleClick} variant='outlined' />
        <Chip label="Primary" color="primary" onClick={handleClick} variant='outlined' />
        <Chip label="Secondary" color="secondary" onClick={handleClick} variant='outlined' />
        <Chip label="Success" color="success" onClick={handleClick} variant='outlined' />
        <Chip label="Error" color="error" onClick={handleClick} variant='outlined' />
        <Chip label="Warning" color="warning" onClick={handleClick} variant='outlined' />
        <Chip label="Info" color="info" onClick={handleClick} variant='outlined' />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Neutral" color="neutral" onClick={handleClick} variant='filled' />
        <Chip label="Primary" color="primary" onClick={handleClick} variant='filled' />
        <Chip label="Secondary" color="secondary" onClick={handleClick} variant='filled' />
        <Chip label="Success" color="success" onClick={handleClick} variant='filled' />
        <Chip label="Error" color="error" onClick={handleClick} variant='filled' />
        <Chip label="Warning" color="warning" onClick={handleClick} variant='filled' />
        <Chip label="Info" color="info" onClick={handleClick} variant='filled' />
      </Stack>
    </Stack>
  );
};
render(<ClickableChips />)`;

const deletableChipCode = `const DeletableChips = () => {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Neutral" color="neutral" onDelete={handleDelete} />
        <Chip label="Primary" color="primary" onDelete={handleDelete} />
        <Chip label="Secondary" color="secondary" onDelete={handleDelete} />
        <Chip label="Success" color="success" onDelete={handleDelete} />
        <Chip label="Error" color="error" onDelete={handleDelete} />
        <Chip label="Warning" color="warning" onDelete={handleDelete} />
        <Chip label="Info" color="info" onDelete={handleDelete} />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Neutral" color="neutral" onDelete={handleDelete} variant='outlined' />
        <Chip label="Primary" color="primary" onDelete={handleDelete} variant='outlined' />
        <Chip label="Secondary" color="secondary" onDelete={handleDelete} variant='outlined' />
        <Chip label="Success" color="success" onDelete={handleDelete} variant='outlined' />
        <Chip label="Error" color="error" onDelete={handleDelete} variant='outlined' />
        <Chip label="Warning" color="warning" onDelete={handleDelete} variant='outlined' />
        <Chip label="Info" color="info" onDelete={handleDelete} variant='outlined' />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Neutral" color="neutral" onDelete={handleDelete} variant='filled' />
        <Chip label="Primary" color="primary" onDelete={handleDelete} variant='filled' />
        <Chip label="Secondary" color="secondary" onDelete={handleDelete} variant='filled' />
        <Chip label="Success" color="success" onDelete={handleDelete} variant='filled' />
        <Chip label="Error" color="error" onDelete={handleDelete} variant='filled' />
        <Chip label="Warning" color="warning" onDelete={handleDelete} variant='filled' />
        <Chip label="Info" color="info" onDelete={handleDelete} variant='filled' />
      </Stack>
    </Stack>
  );
};
render(<DeletableChips />)`;

const clickableDeletableChipCode = `const ClickableAndDeletableChips = () => {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Primary" color="primary" onClick={handleClick} onDelete={handleDelete} />
        <Chip label="Secondary" color="secondary" onClick={handleClick} onDelete={handleDelete} />
        <Chip label="Neutral" color="neutral" onClick={handleClick} onDelete={handleDelete} />
        <Chip label="Success" color="success" onClick={handleClick} onDelete={handleDelete} />
        <Chip label="Error" color="error" onClick={handleClick} onDelete={handleDelete} />
        <Chip label="Warning" color="warning" onClick={handleClick} onDelete={handleDelete} />
        <Chip label="Info" color="info" onClick={handleClick} onDelete={handleDelete} />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Primary" color="primary" onClick={handleClick} onDelete={handleDelete} variant='outlined' />
        <Chip label="Secondary" color="secondary" onClick={handleClick} onDelete={handleDelete} variant='outlined' />
        <Chip label="Neutral" color="neutral" onClick={handleClick} onDelete={handleDelete} variant='outlined' />
        <Chip label="Success" color="success" onClick={handleClick} onDelete={handleDelete} variant='outlined' />
        <Chip label="Error" color="error" onClick={handleClick} onDelete={handleDelete} variant='outlined' />
        <Chip label="Warning" color="warning" onClick={handleClick} onDelete={handleDelete} variant='outlined' />
        <Chip label="Info" color="info" onClick={handleClick} onDelete={handleDelete} variant='outlined' />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Primary" color="primary" onClick={handleClick} onDelete={handleDelete} variant='filled' />
        <Chip label="Secondary" color="secondary" onClick={handleClick} onDelete={handleDelete} variant='filled' />
        <Chip label="Neutral" color="neutral" onClick={handleClick} onDelete={handleDelete} variant='filled' />
        <Chip label="Success" color="success" onClick={handleClick} onDelete={handleDelete} variant='filled' />
        <Chip label="Error" color="error" onClick={handleClick} onDelete={handleDelete} variant='filled' />
        <Chip label="Warning" color="warning" onClick={handleClick} onDelete={handleDelete} variant='filled' />
        <Chip label="Info" color="info" onClick={handleClick} onDelete={handleDelete} variant='filled' />
      </Stack>
    </Stack>
  );
};
render(<ClickableAndDeletableChips />)`;

const clickableLinkChipCode = `const ClickableLinkChips = () => {
  const handleClick = () => {
    console.info('You clicked the Link Chip.');
  };

  return (
    <Stack direction="column" spacing={1}>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Primary" component="a" href="#!" color="primary" onClick={handleClick} />
        <Chip label="Secondary" component="a" href="#!" color="secondary" onClick={handleClick} />
        <Chip label="Neutral" component="a" href="#!" color="neutral" onClick={handleClick} />
        <Chip label="Success" component="a" href="#!" color="success" onClick={handleClick} />
        <Chip label="Error" component="a" href="#!" color="error" onClick={handleClick} />
        <Chip label="Warning" component="a" href="#!" color="warning" onClick={handleClick} />
        <Chip label="Info" component="a" href="#!" color="info" onClick={handleClick} />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Primary" component="a" href="#!" color="primary" onClick={handleClick} variant='outlined' />
        <Chip label="Secondary" component="a" href="#!" color="secondary" onClick={handleClick} variant='outlined' />
        <Chip label="Neutral" component="a" href="#!" color="neutral" onClick={handleClick} variant='outlined' />
        <Chip label="Success" component="a" href="#!" color="success" onClick={handleClick} variant='outlined' />
        <Chip label="Error" component="a" href="#!" color="error" onClick={handleClick} variant='outlined' />
        <Chip label="Warning" component="a" href="#!" color="warning" onClick={handleClick} variant='outlined' />
        <Chip label="Info" component="a" href="#!" color="info" onClick={handleClick} variant='outlined' />
      </Stack>
      <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
        <Chip label="Primary" component="a" href="#!" color="primary" onClick={handleClick} variant='filled' />
        <Chip label="Secondary" component="a" href="#!" color="secondary" onClick={handleClick} variant='filled' />
        <Chip label="Neutral" component="a" href="#!" color="neutral" onClick={handleClick} variant='filled' />
        <Chip label="Success" component="a" href="#!" color="success" onClick={handleClick} variant='filled' />
        <Chip label="Error" component="a" href="#!" color="error" onClick={handleClick} variant='filled' />
        <Chip label="Warning" component="a" href="#!" color="warning" onClick={handleClick} variant='filled' />
        <Chip label="Info" component="a" href="#!" color="info" onClick={handleClick} variant='filled' />
      </Stack>
    </Stack>
  );
};
render(<ClickableLinkChips />)`;

const customDeleteIconCode = `const CustomDeleteIconChips = () => {
  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
      <Chip
        label="Custom delete icon"
        onClick={handleClick}
        onDelete={handleDelete}
        deleteIcon={<IconifyIcon icon="material-symbols:done" sx={{ fontSize: 22 }} />}
      />
      <Chip
        label="Custom delete icon"
        onClick={handleClick}
        onDelete={handleDelete}
        deleteIcon={<IconifyIcon icon="material-symbols:delete" />}
        variant="outlined"
        color='primary'
      />
      <Chip
        label="Custom delete icon"
        onClick={handleClick}
        onDelete={handleDelete}
        deleteIcon={<IconifyIcon icon="material-symbols:delete-forever" sx={{ fontSize: 22 }} />}
        variant="filled"
      />
    </Stack>
  );
};
render(<CustomDeleteIconChips />)`;

const avatarChipsCode = ` <Stack direction="column" spacing={1}>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip avatar={<Avatar>M</Avatar>} label="Avatar" color="primary" />
    <Chip
      avatar={<Avatar alt="Natacha" src="${avatar(5)}" />}
      label="Avatar"
      variant="outlined"
      color="primary"
    />
    <Chip
      avatar={<Avatar alt="Elly" src="${avatar(11)}" />}
      label="Avatar"
      variant="filled"
      color="primary"
    />
  </Stack>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip avatar={<Avatar>M</Avatar>} label="Avatar" color="primary" size="medium" />
    <Chip
      avatar={<Avatar alt="Natacha" src="${avatar(5)}" />}
      label="Avatar"
      variant="outlined"
      color="primary"
      size="medium"
    />
    <Chip
      avatar={<Avatar alt="Elly" src="${avatar(11)}" />}
      label="Avatar"
      variant="filled"
      color="primary"
      size="medium"
    />
  </Stack>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip avatar={<Avatar>M</Avatar>} label="Avatar" color="primary" size='large' />
    <Chip
      avatar={<Avatar alt="Natacha" src="${avatar(5)}" />}
      label="Avatar"
      variant="outlined"
      color="primary"
      size='large'
    />
    <Chip
      avatar={<Avatar alt="Elly" src="${avatar(11)}" />}
      label="Avatar"
      variant="filled"
      color="primary"
      size='large'
    />
  </Stack>
</Stack>`;

const iconChipsCode = `<Stack direction="column" spacing={1}>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      color="primary"
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      variant="outlined"
      color="primary"
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      variant="filled"
      color="primary"
    />
  </Stack>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      color="primary" 
      size="medium"
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      variant="outlined"
      color="primary"
      size="medium"
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      variant="filled"
      color="primary"
      size="medium"
    />
  </Stack>
  <Stack spacing={1} sx={{ flexWrap: 'wrap' }}>
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      color="primary"
      size='large'
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      variant="outlined"
      color="primary"
      size='large'
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      variant="filled"
      color="primary"
      size='large'
    />
  </Stack>
</Stack>`;

const sizeCode = `<Stack direction="column" spacing={1}>
  <Stack spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <Chip label="Small" color='primary'/>
    <Chip label="Medium" size="medium" color='primary' />
    <Chip label="Large" size="large" color='primary' />
  </Stack>
  <Stack spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <Chip label="Small" color='primary' variant="outlined" onDelete={()=>{}}  />
    <Chip label="Medium" size="medium" variant="outlined" color='primary' onDelete={()=>{}}  />
    <Chip label="Large" size="large" variant="outlined" color='primary' onDelete={()=>{}}   />
  </Stack>
  <Stack spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
    <Chip
      icon={<IconifyIcon icon="material-symbols:face" />}
      label="With Icon"
      color="primary"
      variant="filled"
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face"  />}
      label="With Icon"
      variant="filled"
      color="primary"
      size='medium'
    />
    <Chip
      icon={<IconifyIcon icon="material-symbols:face"  />}
      label="With Icon"
      variant="filled"
      color="primary"
      size='large'
    />
  </Stack>
</Stack>`;

const multilineChipCode = `<Box sx={{ width: 100 }}>
  <Chip
    sx={{
      height: 'auto !important',
      [\`& .\${chipClasses.label}\`]: {
        display: 'block',
        whiteSpace: 'normal',
      },
    }}
    label="This is a chip that has multiple lines."
  />
</Box>`;

const chipArrayCode = `const ChipsArray = () => {
  const [chipData, setChipData] = useState([
    { key: 0, label: 'Angular' },
    { key: 1, label: 'jQuery' },
    { key: 2, label: 'Polymer' },
    { key: 3, label: 'React' },
    { key: 4, label: 'Vue.js' },
  ]);

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
  };

  return (
    <Paper
      component={Stack}
      p={0.5}
      m={0}
      sx={{ flexWrap: 'wrap' }}
    >
      {chipData.map((data) => {
        let icon;

        if (data.label === 'React') {
          icon = <IconifyIcon icon="material-symbols:face" sx={{ fontSize: 24 }} />;
        }

        return (
          <ListItem key={data.key} sx={{ width: 'auto', m: 0.5 }}>
            <Chip
              icon={icon}
              label={data.label}
              onDelete={data.label === 'React' ? undefined : handleDelete(data)}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}
render(<ChipsArray />)`;

const ChipDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Chip',
        description: 'Chips are compact elements that represent an input, attribute, or action.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Chip',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-chip`,
        folderLink: `${folderBaseLink}/ChipDoc.jsx`,
      }}
    >
      <DocSection
        title="Basic Chip"
        description="The Chip component supports soft (default), outlined, filled styling."
      >
        <DocCard code={basicChipCode} />
      </DocSection>
      <DocSection
        title="Chip actions"
        descriptionEl={
          <Box
            sx={{
              mb: 2,
            }}
          >
            You can use the following actions.
            <ul>
              <li>
                Chips with the <Code>onClick</Code> prop defined change appearance on focus, hover,
                and click.
              </li>
              <li>
                Chips with the <Code>onDelete</Code> prop defined change appearance on focus, hover,
                and click.
              </li>
              <li>
                Chips with the <Code>onClick</Code> and <Code>component="a"</Code> prop defined
                turns the chip into a clickable link.
              </li>
              <li>
                You can change the delete icon using the <Code>deleteIcon</Code> prop.
              </li>
            </ul>
          </Box>
        }
      >
        <DocNestedSection title="Clickable" id={kebabCase('Clickable')}>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            Chips with the <Code>onClick</Code> prop defined change appearance on focus, hover, and
            click.
          </Typography>
          <DocCard code={clickableChipCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Deletable" id={kebabCase('Deletable')}>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            Chips with the <Code>onDelete</Code> prop defined change appearance on focus, hover, and
            click.
          </Typography>
          <DocCard code={deletableChipCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Clickable and deletable" id={kebabCase('Clickable and deletable')}>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            Chips with both the <Code>onClick</Code> and <Code>onDelete</Code> prop defined change
            appearance on focus, hover, and click.
          </Typography>
          <DocCard code={clickableDeletableChipCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Clickable link" id={kebabCase('Clickable link')}>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            Chips with the <Code>onClick</Code> and <Code>component="a"</Code> prop defined turns
            the chip into a clickable link.
          </Typography>
          <DocCard code={clickableLinkChipCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Custom delete icon" id={kebabCase('Custom delete icon')}>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            You can change the delete icon using the <Code>deleteIcon</Code> prop.
          </Typography>
          <DocCard code={customDeleteIconCode} noInline />
        </DocNestedSection>
      </DocSection>
      <DocSection title="Chip adornments">
        <DocNestedSection title="Avatar chip" id={kebabCase('Avatar chip')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the <Code>avatar</Code> prop to add an avatar.
          </Typography>
          <DocCard code={avatarChipsCode} scope={{ avatar }} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Icon chip" id={kebabCase('Icon chip')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use the <Code>icon</Code> prop to add an icon.
          </Typography>
          <DocCard code={iconChipsCode} scope={{ avatar }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Chip Sizes"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can use the <Code>size</Code> prop to define a medium or large Chip. Default size is{' '}
            <Code>small</Code>.
          </Typography>
        }
      >
        <DocCard code={sizeCode} />
      </DocSection>
      <DocSection
        title="Multiline chip"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            By default, Chips displays labels only in a single line. To have them support multiline
            content, use the <Code>sx</Code> prop to add <Code>height: auto</Code> to the Chip
            component, and <Code>whiteSpace: normal</Code> to the <Code>label</Code> styles.
          </Typography>
        }
      >
        <DocCard code={multilineChipCode} />
      </DocSection>
      <DocSection
        title="Chip array"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            An example of rendering multiple chips from an array of values. Deleting a chip removes
            it from the array. Note that since no <Code>onClick</Code> prop is defined, the{' '}
            <Code>Chip</Code> can be focused, but does not gain depth while clicked or touched.
          </Typography>
        }
      >
        <DocCard code={chipArrayCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default ChipDoc;
