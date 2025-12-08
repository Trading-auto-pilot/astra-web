import { memo } from 'react';
import { Typography } from '@mui/material';
import { green } from '@mui/material/colors';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const circularIndeterminateCode = `<Stack spacing={2}>
  <CircularProgress color="secondary" />
  <CircularProgress color="success" />
  <CircularProgress color="error" />
  <CircularProgress color="warning" />
  <CircularProgress color="info" />
</Stack>`;

const linearIndeterminateCode = `<Stack direction="column" spacing={2}>
  <LinearProgress color="inherit" />
  <LinearProgress color="success" />
  <LinearProgress color="error" />
  <LinearProgress color="warning" />
  <LinearProgress color="info" />
</Stack>`;

const linearDeterminateCode = `
const LinearProgressWithLabel = (props) => {
  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Box sx={{ width: 1, mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{\`\${Math.round(
          props.value,
        )}%\`}</Typography>
      </Box>
    </Stack>
  );
};

const LinearDeterminate = ({ step = 10, interval = 500 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * step;
        return Math.min(oldProgress + diff, 100);
      });
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [step, interval]);

  return (
    <Stack direction="column" spacing={2}>
      <>
        <Typography color="text.primary" sx={{ fontWeight: 600 }} >
          Uncontrolled Progress
        </Typography>
        <LinearProgress variant="determinate" value={40} sx={{ height: 12 }} />
      </>
      <>
        <Typography color="text.primary" sx={{ fontWeight: 600 }} >
          Controlled Progress
        </Typography>
        <LinearProgressWithLabel value={progress} />
      </>
    </Stack>
  );
}
render(<LinearDeterminate/>)
`.trim();

const linearBufferCode = `
const LinearBuffer = ({ step = 10, interval = 500 }) => {
  const [progress, setProgress] = useState(0);
  const [buffer, setBuffer] = useState(10);

  const progressRef = useRef(() => {});
  useEffect(() => {
    progressRef.current = () => {
      if (progress > 100) {
        setProgress(0);
        setBuffer(10);
      } else {
        const diff = Math.random() * 10;
        const diff2 = Math.random() * 10;
        setProgress(progress + diff);
        setBuffer(progress + diff + diff2);
      }
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      progressRef.current();
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Stack direction="column" spacing={2}>
        <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
        <LinearProgress color="secondary" variant="buffer" value={progress} valueBuffer={buffer} />
    </Stack>
  );
}
render(<LinearBuffer/>)
`.trim();

const circularDeterminateCode = `
const CircularDeterminate = ({ step = 10, interval = 800 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + step));
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [step, interval]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography sx={{ mb: 2, fontWeight: 500 }} color="text.primary">
          Uncontrolled Progress
        </Typography>
        <Stack spacing={2}>
          <CircularProgress variant="determinate" value={25} />
          <CircularProgress variant="determinate" value={50} />
          <CircularProgress variant="determinate" value={75} />
          <CircularProgress variant="determinate" value={100} />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Typography sx={{ mb: 2, fontWeight: 500 }} color="text.primary">
          Controlled Progress
        </Typography>
        <CircularProgress variant="determinate" value={progress} />
      </Grid>
    </Grid>
  );
}
render(<CircularDeterminate/>)
`.trim();

const circularLabelCode = `
const CircularProgressWithLabel = (props) => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{\`\${Math.round(props.value)}%\`}</Typography>
      </Box>
    </Box>
  );
};

const CircularLabel = ({ step = 10, interval = 800 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 0 : prevProgress + step));
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [step, interval]);

  return (
    <Stack spacing={2}>
      <CircularProgressWithLabel value={progress} />
      <CircularProgressWithLabel value={80} variant="determinate" color="success" />
      <CircularProgressWithLabel value={55} variant="determinate" color="info" />
      <CircularProgressWithLabel value={35} variant="determinate" color="warning" />
      <CircularProgressWithLabel value={10} variant="determinate" color="error" />
    </Stack>
  );
}

render(<CircularLabel />);
`.trim();

const interactiveProgressCode = `import { green } from '@mui/material/colors';

const CircularIntegration = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      '&:hover': {
        bgcolor: green[700],
      },
    }),
  };

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <Stack sx={{ alignItems: 'center' }}>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Fab aria-label="save" color="primary" sx={buttonSx} onClick={handleButtonClick}>
          {success ? (
            <IconifyIcon icon="material-symbols-light:check-circle" sx={{ fontSize: 24 }} />
          ) : (
            <IconifyIcon icon="material-symbols-light:save" sx={{ fontSize: 24 }} />
          )}
        </Fab>
        {loading && (
          <CircularProgress
            size={68}
            sx={{
              color: 'success.main',
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>
      <Box sx={{ m: 1, position: 'relative' }}>
        <Button variant="contained" sx={buttonSx} disabled={loading} onClick={handleButtonClick}>
          Accept terms
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: 'success.main',
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: -1.5,
              marginLeft: -1.5,
            }}
          />
        )}
      </Box>
    </Stack>
  );
};
render(<CircularIntegration/>)
`.trim();

// Memoized Circular Indeterminate component
const CircularIndeterminate = memo(() => (
  <DocCard code={circularIndeterminateCode} sx={{ my: 3 }} />
));
// Memoized Linear Indeterminate component
const LinearIndeterminate = memo(() => <DocCard code={linearIndeterminateCode} sx={{ my: 3 }} />);

const ProgressDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Progress',
        description:
          'Progress indicators commonly known as spinners, express an unspecified wait time or display the length of a process.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Progress',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-progress`,
        folderLink: `${folderBaseLink}/ProgressDoc.jsx`,
      }}
    >
      <DocSection title="Circular Progress">
        <DocNestedSection id="circular-indeterminate" title="Circular Indeterminate">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use &nbsp;<Code>CircularProgress</Code>&nbsp; component for simple circular progress
            with no set end time. It supports a &nbsp;<Code>color</Code>&nbsp; prop, where the
            default is &nbsp;
            <Code>primary</Code>.
          </Typography>
          <CircularIndeterminate />
        </DocNestedSection>
        <DocNestedSection id="circular-determinate" title="Circular Determinate">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Control &nbsp;<Code>Circular Progress</Code>&nbsp; with a state-managed &nbsp;
            <Code>value</Code>&nbsp; prop for task completion.
          </Typography>
          <DocCard code={circularDeterminateCode} noInline sx={{ my: 3 }} />
        </DocNestedSection>
        <DocNestedSection id="circular-label" title="Circular Label">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Show progress inside &nbsp;<Code>CircularProgress</Code>&nbsp; using a label with the
            &nbsp;<Code>variant='determinate'</Code>&nbsp; prop.
          </Typography>
          <DocCard code={circularLabelCode} noInline sx={{ my: 3 }} />
        </DocNestedSection>
        <DocNestedSection id="interactive-integration" title="Interactive Integration">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Manage Circular Progress with a state-controlled value prop for dynamic task completion.
          </Typography>
          <DocCard code={interactiveProgressCode} scope={{ green }} noInline />
        </DocNestedSection>
      </DocSection>
      <DocSection title="Linear Progress">
        <DocNestedSection id="linear-indeterminate" title="Linear Indeterminate">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use &nbsp;<Code>LinearProgress</Code>&nbsp; component for simple linear progress.
          </Typography>
          <LinearIndeterminate />
        </DocNestedSection>

        <DocNestedSection id="linear-determinate" title="Linear Determinate">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Manage &nbsp;<Code>value</Code>&nbsp; prop with the help of a state for controlled
            linear progress.
          </Typography>
          <DocCard code={linearDeterminateCode} noInline sx={{ my: 3 }} />
        </DocNestedSection>

        <DocNestedSection id="linear-buffer" title="Linear Buffer">
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Use &nbsp;<Code>variant='buffer'</Code>&nbsp; and &nbsp;<Code>valueBuffer</Code>&nbsp;
            for staged tasks or buffering.
          </Typography>
          <DocCard code={linearBufferCode} noInline />
        </DocNestedSection>
      </DocSection>
    </DocPageLayout>
  );
};

export default ProgressDoc;
