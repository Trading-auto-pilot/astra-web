import { Typography } from '@mui/material';
import { initialConfig } from 'config';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const avatar = (index) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;

const simpleListCode = `<Stack sx={{ justifyContent: 'center' }}>
  <Box
    sx={{
      border: 1,
      borderColor: 'divider',
      width: 1,
      maxWidth: 360,
      bgcolor: 'background.default',
    }}
  >
    <List>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <IconifyIcon
              icon="material-symbols-light:inbox"
              sx={{ mr: 2.5, fontSize: 30 }}
            />
          </ListItemIcon>
          <ListItemText primary="Inbox" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemIcon>
            <IconifyIcon
              icon="material-symbols-light:drafts"
              sx={{ mr: 2.5, fontSize: 30 }}
            />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItemButton>
      </ListItem>
    </List>
    <Divider />
    <List>
      <ListItem disablePadding>
        <ListItemButton>
          <ListItemText primary="Trash" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton component="a" href="#simple-list">
          <ListItemText primary="Spam" />
        </ListItemButton>
      </ListItem>
    </List>
  </Box>
</Stack>`.trim();

const nestedListCode = `
const NestedList = () => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          width: 1,
          maxWidth: 360,
          bgcolor: 'background.default',
        }}
      >
        <List
          sx={{ width: 1, maxWidth: 360, bgcolor: 'background.paper' }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Nested List Items
            </ListSubheader>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <IconifyIcon icon="material-symbols-light:send" sx={{ mr: 2.5, fontSize: 30 }} />
            </ListItemIcon>
            <ListItemText primary="Sent mail" />
          </ListItemButton>{' '}
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <IconifyIcon icon="material-symbols-light:inbox" sx={{ mr: 2.5, fontSize: 30 }} />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
            {open ? (
              <IconifyIcon
                icon="material-symbols-light:keyboard-arrow-up"
                sx={{ mr: 2.5, fontSize: 30 }}
              />
            ) : (
              <IconifyIcon
                icon="material-symbols-light:keyboard-arrow-down"
                sx={{ mr: 2.5, fontSize: 30 }}
              />
            )}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <IconifyIcon
                    icon="material-symbols-light:star-outline"
                    sx={{ mr: 2.5, fontSize: 30 }}
                  />
                </ListItemIcon>
                <ListItemText primary="Starred" />
              </ListItemButton>
            </List>
          </Collapse>
          <ListItemButton>
            <ListItemIcon>
              <IconifyIcon icon="material-symbols-light:drafts" sx={{ mr: 2.5, fontSize: 30 }} />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItemButton>
        </List>
      </Box>
    </Stack>
  );
};
render (<NestedList/>)
`.trim();

const folderListCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <Box
    sx={{
      border: 1,
      borderColor: 'divider',
      width: 1,
      maxWidth: 360,
      bgcolor: 'background.default',
    }}
  >
    <List sx={{ width: 1, maxWidth: 360, bgcolor: 'background.paper' }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <IconifyIcon icon="material-symbols-light:image" sx={{ fontSize: 24 }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Photos" secondary="Jan 1, 2024" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <IconifyIcon icon="material-symbols-light:work" sx={{ fontSize: 24 }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Work" secondary="April 28, 2024" />
      </ListItem>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <IconifyIcon icon="material-symbols-light:beach-access" sx={{ fontSize: 24 }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Vacation" secondary="July 6, 2024" />
      </ListItem>
    </List>
  </Box>
</Stack>
`.trim();

const interactiveListCode = `
const InteractiveList = () => {
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);

  return (
    <>
      <FormGroup row>
        <FormControlLabel
          control={
            <Checkbox checked={dense} onChange={(event) => setDense(event.target.checked)} />
          }
          label="Enable dense"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={secondary}
              onChange={(event) => setSecondary(event.target.checked)}
            />
          }
          label="Enable secondary text"
        />
      </FormGroup>
      <Stack sx={{ justifyContent: 'center' }}>
        <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Text only
              </Typography>
              <Box sx={{ bgcolor: 'background.elevation1' }}>
                <List dense={dense}>
                  <ListItem>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Icon with text
              </Typography>
              <Box sx={{ bgcolor: 'background.elevation1' }}>
                <List dense={dense}>
                  <ListItem>
                    <ListItemIcon>
                      <IconifyIcon
                        icon="material-symbols-light:folder"
                        sx={{ mr: 1.5, fontSize: 24 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <IconifyIcon
                        icon="material-symbols-light:folder"
                        sx={{ mr: 1.5, fontSize: 24 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <IconifyIcon
                        icon="material-symbols-light:folder"
                        sx={{ mr: 1.5, fontSize: 24 }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Avatar with text
              </Typography>
              <Box sx={{ bgcolor: 'background.elevation1' }}>
                <List dense={dense}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt="James Smith" src="${avatar(1)}" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt="James Smith" src="${avatar(2)}" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar alt="James Smith" src="${avatar(3)}" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 12, lg: 6 }}>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Avatar with text and icon
              </Typography>
              <Box sx={{ bgcolor: 'background.elevation1' }}>
                <List dense={dense}>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <IconifyIcon icon="material-symbols-light:delete" sx={{ fontSize: 24 }} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar alt="James Smith" src="${avatar(3)}" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <IconifyIcon icon="material-symbols-light:delete" sx={{ fontSize: 24 }} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar alt="James Smith" src="${avatar(2)}" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete">
                        <IconifyIcon icon="material-symbols-light:delete" sx={{ fontSize: 24 }} />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar alt="James Smith" src="${avatar(1)}" />
                    </ListItemAvatar>
                    <ListItemText
                      primary="Single-line item"
                      secondary={secondary ? 'Secondary text' : null}
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Stack>
    </>
  );
};
render(<InteractiveList/>)
`.trim();

const selectedListCode = `
const ListItemSelected = () => {
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Box
        sx={{
          width: 1,
          maxWidth: 360,
          py: 0.5,
          border: 1,
          borderColor: 'background.elevation2',
        }}
      >
        <List>
          <ListItem
            disablePadding
            secondaryAction={
              <IconButton edge="end" onClick={(e) => e.stopPropagation()}>
                <IconifyIcon icon="material-symbols-light:send-rounded" sx={{ fontSize: 24 }} />
              </IconButton>
            }
          >
            <ListItemButton selected={selectedIndex === 0} onClick={() => handleListItemClick(0)}>
              <ListItemAvatar>
                <Avatar src="${avatar(3)}" alt="Morgan Bennett" />
              </ListItemAvatar>
              <ListItemText primary="Morgan Bennett" />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            secondaryAction={
              <IconButton edge="end" onClick={(e) => e.stopPropagation()}>
                <IconifyIcon icon="material-symbols-light:send-rounded" sx={{ fontSize: 24 }} />
              </IconButton>
            }
          >
            <ListItemButton selected={selectedIndex === 1} onClick={() => handleListItemClick(1)}>
              <ListItemAvatar>
                <Avatar src="${avatar(1)}" alt="Jordan Sinclair" />
              </ListItemAvatar>
              <ListItemText primary="Jordan Sinclair" />
            </ListItemButton>
          </ListItem>
          <ListItem
            disablePadding
            secondaryAction={
              <IconButton edge="end" onClick={(e) => e.stopPropagation()}>
                <IconifyIcon icon="material-symbols-light:send-rounded" sx={{ fontSize: 24 }} />
              </IconButton>
            }
          >
            <ListItemButton selected={selectedIndex === 2} onClick={() => handleListItemClick(2)}>
              <ListItemAvatar>
                <Avatar src="${avatar(2)}" alt="Avery Mitchell" />
              </ListItemAvatar>
              <ListItemText primary="Avery Mitchell" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Stack>
  );
};
render(<ListItemSelected/>)
`.trim();

const alignListItemsCode = `
const AlignItemsList = () => {
  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <List sx={{ width: 1, maxWidth: 360, bgcolor: 'background.elevation1' }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="James Smith" src="${avatar(1)}" />
          </ListItemAvatar>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="James Smith" src="${avatar(2)}" />
          </ListItemAvatar>
          <ListItemText
            primary="Summer BBQ"
            secondary={
              <Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  to Scott, Alex, Jennifer
                </Typography>
                {" — Wish I could come, but I'm out of town this…"}
              </Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="James Smith" src="${avatar(1)}" />
          </ListItemAvatar>
          <ListItemText
            primary="Oui Oui"
            secondary={
              <Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Sandra Adams
                </Typography>
                {' — Do you have Paris recommendations? Have you ever…'}
              </Fragment>
            }
          />
        </ListItem>
      </List>
    </Stack>
  );
};
render(<AlignItemsList/>)
`.trim();

const checkboxListCode = `
const listStyles = { width: 1, maxWidth: 360, p: 1.5, bgcolor: 'background.paper' };
const CheckboxListComparison = () => {
  const [checkedPrimary, setCheckedPrimary] = React.useState([0]);
  const [checkedSecondary, setCheckedSecondary] = React.useState([0]);

  const handleTogglePrimary = (value) => () => {
    const currentIndex = checkedPrimary.indexOf(value);
    const newChecked = [...checkedPrimary];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedPrimary(newChecked);
  };

  const handleToggleSecondary = (value) => () => {
    const currentIndex = checkedSecondary.indexOf(value);
    const newChecked = [...checkedSecondary];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedSecondary(newChecked);
  };

  const items = [
    { id: 0, name: "Morgan Bennett", avatar: '/static/images/avatar/1.jpg' },
    { id: 1, name: "Jordan Sinclair", avatar: '/static/images/avatar/2.jpg' },
    { id: 2, name: "Avery Mitchell", avatar: '/static/images/avatar/3.jpg' },
  ];

  return (
      <Grid container spacing={2} sx={{ justifyContent: 'center', flexGrow: 1 }} >
        {/* Checkbox as Primary Action */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Typography sx={{ mb: 2, fontWeight: 500, whiteSpace: 'noWrap' }} variant="body1" >
            Checkbox as Primary Action
          </Typography>
          <>
            <List sx={{...listStyles, bgcolor: 'background.elevation1'}}>
              {items.map(({ id, name }) => {
                const labelId = \`checkbox-list-primary-label-\${id}\`;
                return (
                  <ListItem
                    key={id}
                    sx={{ p: 0 }}
                    secondaryAction={
                      <IconButton edge="end" aria-label="comments">
                        <IconifyIcon
                          icon="material-symbols-light:comment"
                          fontSize={20}
                        />
                      </IconButton>
                    }
                  >
                    <ListItemButton role={undefined} onClick={handleTogglePrimary(id)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checkedPrimary.indexOf(id) !== -1}
                          tabIndex={-1}
                          disableRipple
                          slotProps={{
                            input: {
                              'aria-labelledby': labelId,
                            },
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText id={labelId} primary={name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </>
        </Grid>

        {/* Checkbox as Secondary Action */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Typography sx={{ mb: 2, fontWeight: 500, whiteSpace: 'noWrap' }} variant="body1" >
            Checkbox as Secondary Action
          </Typography>
          <>
            <List dense sx={{...listStyles, bgcolor: 'background.elevation1'}}>
              {items.map(({ id, name, avatar }) => {
                const labelId = \`checkbox-list-secondary-label-\${id}\`;
                return (
                  <ListItem
                    key={id}
                    sx={{ p: 0 }}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleToggleSecondary(id)}
                        checked={checkedSecondary.indexOf(id) !== -1}
                        slotProps={{
                          input: {
                            'aria-labelledby': labelId,
                          },
                        }}
                      />
                    }
                  >
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar src={avatar} alt={name} />
                      </ListItemAvatar>
                      <ListItemText id={labelId} primary={name} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </>
        </Grid>
      </Grid>
  );
};
render(<CheckboxListComparison/>)
`.trim();

const switchListCode = `
const SwitchListSecondary = () => {
  const [checked, setChecked] = useState(['wifi']);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <List
        sx={{ width: 1, maxWidth: 360, bgcolor: 'background.elevation1' }}
        subheader={<ListSubheader>Settings</ListSubheader>}
      >
        <ListItem>
          <ListItemIcon>
            {checked.includes('wifi') ? (
              <IconifyIcon
                icon="material-symbols-light:wifi-rounded"
                fontSize={30}
                sx={{ mr: 2 }}
              />
            ) : (
              <IconifyIcon
                icon="material-symbols-light:wifi-off-rounded"
                fontSize={30}
                sx={{ mr: 2 }}
              />
            )}
          </ListItemIcon>
          <ListItemText id="switch-list-label-wifi" primary="Wi-Fi" />
          <Switch
            edge="end"
            onChange={handleToggle('wifi')}
            checked={checked.indexOf('wifi') !== -1}
            slotProps={{
              input: {
                'aria-labelledby': 'switch-list-label-wifi',
              },
            }}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            {checked.includes('bluetooth') ? (
              <IconifyIcon
                icon="material-symbols-light:bluetooth-rounded"
                fontSize={30}
                sx={{ mr: 2 }}
              />
            ) : (
              <IconifyIcon
                icon="material-symbols-light:bluetooth-disabled"
                fontSize={30}
                sx={{ mr: 2 }}
              />
            )}
          </ListItemIcon>
          <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" />
          <Switch
            edge="end"
            onChange={handleToggle('bluetooth')}
            checked={checked.indexOf('bluetooth') !== -1}
            slotProps={{
              input: {
                'aria-labelledby': 'switch-list-label-bluetooth',
              },
            }}
          />
        </ListItem>
      </List>
    </Stack>
  );
};
render(<SwitchListSecondary/>)
`.trim();

const pinnedSubHeaderListCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <List
    sx={{
      width: 1,
      maxWidth: 360,
      bgcolor: 'background.elevation1',
      position: 'relative',
      overflow: 'auto',
      border: 1,
      borderColor: 'divider',
      maxHeight: 300,
      '& ul': { padding: 0 },
    }}
    subheader={<li />}
  >
    {[0, 1, 2, 3, 4].map((sectionId) => (
      <li key={\`section-\${sectionId}\`}>
        <ul>
          <ListSubheader>{\`I'm sticky \${sectionId}\`}</ListSubheader>
          {[0, 1, 2].map((item) => (
            <ListItem key={\`item-\${sectionId}-\${item}\`}>
              <ListItemText primary={\`Item \${item}\`} />
            </ListItem>
          ))}
        </ul>
      </li>
    ))}
  </List>
</Stack>
`.trim();

const insetListCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <List
    sx={{ width: 1, maxWidth: 360, bgcolor: 'background.elevation1' }}
    aria-label="contacts"
  >
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: 56 }}>
          <IconifyIcon icon="material-symbols-light:account-box" fontSize={30} />
        </ListItemIcon>
        <ListItemText primary="Chelsea Otakan" />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemText inset primary="Eric Hoffman" />
      </ListItemButton>
    </ListItem>
  </List>
</Stack>
`.trim();

const gutteredListCode = `
<Stack sx={{ justifyContent: 'center' }}>
  <List
    sx={{ width: 1, maxWidth: 360, bgcolor: 'background.elevation1' }}
    aria-label="contacts"
  >
    {[1, 2, 3].map((value) => (
    <ListItem
      key={value}
      disableGutters
      secondaryAction={
        <IconButton aria-label="comment">
            <IconifyIcon icon="material-symbols-light:comment" fontSize={30} />
        </IconButton>
      }
    >
      <ListItemText primary={\`Line item \${value}\`} />
    </ListItem>
  ))}
  </List>
</Stack>
`.trim();

const ListDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'List',
        description: 'Lists are continuous, vertical indexes of text or images.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'List',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-list`,
        folderLink: `${folderBaseLink}/ListDoc.jsx`,
      }}
    >
      <DocSection title="Simple List">
        <DocCard code={simpleListCode} />
      </DocSection>
      <DocSection title="Nested List">
        <DocCard code={nestedListCode} noInline />
      </DocSection>
      <DocSection title="Folder List">
        <DocCard code={folderListCode} />
      </DocSection>
      <DocSection title="Interactive List">
        <DocCard code={interactiveListCode} scope={{ avatar }} noInline />
      </DocSection>
      <DocSection title="Selected ListItem">
        <DocCard code={selectedListCode} scope={{ avatar }} noInline />
      </DocSection>
      <DocSection
        title="Align List Items"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            When displaying three lines or more, the avatar is not aligned at the top. You should
            set the &nbsp;
            <Code>alignItems="flex-start"</Code>&nbsp; prop to align the avatar at the top,
            following the Material Design guidelines:
          </Typography>
        }
      >
        <DocCard code={alignListItemsCode} scope={{ avatar }} noInline />
      </DocSection>
      <DocSection title="List Controls">
        <DocNestedSection id="checkbox" title="Checkbox">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            A checkbox can either be a primary action or a secondary action.
          </Typography>
          <DocCard code={checkboxListCode} scope={{ avatar }} noInline sx={{ my: 5 }} />
        </DocNestedSection>
        <DocNestedSection id="switch" title="Switch">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The switch is the secondary action and a separate target.
          </Typography>
          <DocCard code={switchListCode} noInline />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Pinned Subheader List"
        description="Upon scrolling, subheaders remain pinned to the top of the screen until pushed off screen by the next subheader. This feature relies on CSS sticky positioning."
      >
        <DocCard code={pinnedSubHeaderListCode} />
      </DocSection>
      <DocSection
        title="Inset List"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The &nbsp;
            <Code>inset</Code>&nbsp; prop enables a list item that does not have a leading icon or
            avatar to align correctly with items that do.
          </Typography>
        }
      >
        <DocCard code={insetListCode} />
      </DocSection>
      <DocSection
        title="Guttered List"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            When rendering a list within a component that defines its own gutters, &nbsp;
            <Code>ListItem</Code>&nbsp; gutters can be disabled with &nbsp;
            <Code>disableGutters</Code>&nbsp;.
          </Typography>
        }
      >
        <DocCard code={gutteredListCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default ListDoc;
