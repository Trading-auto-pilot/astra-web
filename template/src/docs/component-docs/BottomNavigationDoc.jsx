import { initialConfig } from 'config';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const avatar = (index) => `${initialConfig.assetsDir}/images/avatar/${index}.webp`;

const simpleBottomNavigation = `const SimpleBottomNavigation = () => {
  const [value, setValue] = useState(0);

  return (
    <Stack sx={{ overflowX: 'auto' }}>
      <Box sx={{ mx: 'auto', width: 500 }}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Recents"
            icon={
              <IconifyIcon icon="material-symbols-light:autorenew" sx={{ fontSize: 24 }} />
            }
          />
          <BottomNavigationAction
            label="Favorites"
            icon={<IconifyIcon icon="material-symbols-light:favorite" sx={{ fontSize: 24 }} />}
          />
          <BottomNavigationAction
            label="Nearby"
            icon={<IconifyIcon icon="material-symbols-light:location-on" sx={{ fontSize: 24 }} />}
          />
        </BottomNavigation>
      </Box>
    </Stack>
  );
};
render(<SimpleBottomNavigation/>)
`.trim();

const noLabelBottomNavigation = `
const LabelBottomNavigation = () => {
  const [value, setValue] = useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack sx={{ overflowX: 'auto' }}>
      <BottomNavigation sx={{ mx: 'auto', width: 500 }} value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<IconifyIcon icon="material-symbols-light:autorenew" sx={{ fontSize: 24 }} />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<IconifyIcon icon="material-symbols-light:favorite" sx={{ fontSize: 24 }} />}
        />
        <BottomNavigationAction
          label="Nearby"
          value="nearby"
          icon={<IconifyIcon icon="material-symbols-light:location-on" sx={{ fontSize: 24 }} />}
        />
        <BottomNavigationAction
          label="Folder"
          value="folder"
          icon={<IconifyIcon icon="material-symbols-light:folder" sx={{ fontSize: 24 }} />}
        />
      </BottomNavigation>
    </Stack>
  );
};
render(<LabelBottomNavigation />)
`.trim();

const fixedBottomNavigation = `const messageExamples = [
  {
    primary: 'Brunch this week?',
    secondary: "I'll be in the neighbourhood this week. Let's grab a bite to eat",
    person: "${avatar(1)}",
  },

  {
    primary: 'Yes!',
    secondary: 'I have the tickets to the ReactConf for this year.',
    person: "${avatar(2)}",
  },
  {
    primary: "Doctor's Appointment",
    secondary: 'My appointment for the doctor was rescheduled for next Saturday.',
    person: "${avatar(3)}",
  },
  {
    primary: 'Summer BBQ',
    secondary: \`Who wants to have a cookout this weekend? I just got some furniture
      for my backyard and would love to fire up the grill.\`,
    person: "${avatar(4)}",
  },
  {
    primary: 'Meeting Reminder',
    secondary: 'Don’t forget about our meeting tomorrow at 10 AM.',
    person: "${avatar(2)}",
  },
  {
    primary: 'Weekend Plans',
    secondary: 'Do you have any plans for this weekend? We could catch up!',
    person: "${avatar(1)}",
  },
];

const FixedBottomNavigation = () => {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const [messages, setMessages] = useState(() => messageExamples);

  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
    setMessages(messageExamples);
  }, [value]);

  return (
    <Stack sx={{ justifyContent: 'center' }}>
      <Box
        sx={{
          maxWidth: 400,
          height: 400,
          flexGrow: 1,
          overflow: 'scroll',
          boxShadow: (theme) => theme.vars.shadows[1],
        }}
      >
        <Box sx={{ position: 'relative' }} ref={ref}>
          <CssBaseline />
          <List>
            {messages.map(({ primary, secondary, person }, index) => (
              <ListItemButton key={index + person}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={person} />
                </ListItemAvatar>
                <ListItemText primary={primary} secondary={secondary} />
              </ListItemButton>
            ))}
          </List>
          <Paper sx={{ position: 'sticky', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
            >
              <BottomNavigationAction
                label="Recents"
                icon={<IconifyIcon icon="material-symbols-light:autorenew" sx={{ fontSize: 24 }} />}
              />
              <BottomNavigationAction
                label="Favorites"
                icon={<IconifyIcon icon="material-symbols-light:favorite" sx={{ fontSize: 24 }} />}
              />
              <BottomNavigationAction
                label="Archive"
                icon={<IconifyIcon icon="material-symbols-light:favorite" sx={{ fontSize: 24 }} />}
              />
            </BottomNavigation>
          </Paper>
        </Box>
      </Box>
    </Stack>
  );
};
render(<FixedBottomNavigation/>)
`.trim();

const BottomNavigationDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Bottom Navigation',
        description:
          'The Bottom Navigation bar allows movement between primary destinations in an app.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Bottom Navigation',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-bottom-navigation`,
        folderLink: `${folderBaseLink}/BottomNavigationDoc.jsx`,
      }}
    >
      <DocSection title="Simple">
        <DocCard code={simpleBottomNavigation} noInline />
      </DocSection>

      <DocSection title="No Label">
        <DocCard code={noLabelBottomNavigation} noInline />
      </DocSection>

      <DocSection title="Fixed">
        <DocCard code={fixedBottomNavigation} scope={{ avatar }} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default BottomNavigationDoc;
