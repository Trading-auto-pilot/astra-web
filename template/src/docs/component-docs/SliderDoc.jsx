import { Typography } from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const continuousSlidersCode = `<Stack direction='column' spacing={2}>
	<Stack spacing={1} sx={{ alignItems: 'center' }}>
	  <IconifyIcon icon="material-symbols:volume-down" sx={{ fontSize: 24 }} />
	  <Slider aria-label="Volume" defaultValue={30}/>
	  <IconifyIcon icon="material-symbols:volume-up" sx={{ fontSize: 24 }} />	  
	</Stack>
	<Slider disabled defaultValue={30} aria-label="Disabled slider" />
</Stack>`;

const sliderSizesCode = `<Stack direction='column' spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
  <Slider
    size="small"
    defaultValue={70}
    aria-label="Small"
    valueLabelDisplay="auto"
  />
  <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
</Stack>`;

const discreteSlidersCode = `<Stack direction='column' spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
  <Slider
    aria-label="Temperature"
    defaultValue={30}
    valueLabelDisplay="auto"
    shiftStep={30}
    step={10}
    marks
    min={10}
    max={110}
  />
  <Slider defaultValue={30} step={10} marks min={10} max={110} disabled />
</Stack>`;

const smallStepsCode = `<Stack direction='column' spacing={2} sx={{ alignItems: 'center' }}>
  <Slider
    aria-label="Small steps"
    defaultValue={0.00000005}
    step={0.00000001}
    marks
    min={-0.00000005}
    max={0.0000001}
    valueLabelDisplay="auto"
  />
</Stack>`;

const customMarksCode = `const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

const valuetext = (value) => {
  return \`\${value}°C\`;
}

const DiscreteSliderMarks = () => {
  return (
    <Stack direction='column' spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
      <Slider
        aria-label="Custom marks"
        defaultValue={20}
        getAriaValueText={valuetext}
        step={10}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Stack>
  );
}
render(<DiscreteSliderMarks />)`;

const restrictedValuesCode = `const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

const valuetext = (value) => {
  return \`\${value}°C\`;
}

const DiscreteSliderValues = () => {
  return (
    <Stack direction='column' spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
      <Slider
        aria-label="Restricted values"
        defaultValue={20}
        getAriaValueText={valuetext}
        step={null}
        valueLabelDisplay="auto"
        marks={marks}
      />
    </Stack>
  );
}
render(<DiscreteSliderValues />)`;

const labelAlwaysVisibleCode = `const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

const valuetext = (value) => {
  return \`\${value}°C\`;
}

const DiscreteSliderLabel = () => {
  return (
    <Stack direction='column' spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
      <Slider
        aria-label="Always visible"
        defaultValue={80}
        getAriaValueText={valuetext}
        step={10}
        marks={marks}
        valueLabelDisplay="on"
      />
    </Stack>
  );
}
render(<DiscreteSliderLabel />)`;

const rangeCode = `const RangeSlider = () => {
  const [value, setValue] = useState([20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Stack direction="column" spacing={1}>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
      />
    </Stack>
  );
};
render(<RangeSlider />)`;

const minimumDistanceCode = `const minDistance = 10;

const MinimumDistanceSlider = () => {
  const [value1, setValue1] = useState([20, 37]);

  const handleChange1 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  const [value2, setValue2] = useState([20, 37]);

  const handleChange2 = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue);
    }
  };

  return (
    <Stack direction='column' spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
      <Slider
        getAriaLabel={() => 'Minimum distance'}
        value={value1}
        onChange={handleChange1}
        valueLabelDisplay="auto"
        disableSwap
      />
      <Slider
        getAriaLabel={() => 'Minimum distance shift'}
        value={value2}
        onChange={handleChange2}
        valueLabelDisplay="auto"
        disableSwap
      />
    </Stack>
  );
}
render(<MinimumDistanceSlider />)`;

const sliderWithInputFieldCode = `const InputSlider = () => {
  const [value, setValue] = useState(30);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ width: 300 }}>
      <Typography id="input-slider" gutterBottom>
        Volume
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid>
          <IconifyIcon icon="material-symbols:volume-up" sx={{ fontSize: 24 }} />
        </Grid>
        <Grid size={7}>
          <Slider
            value={typeof value === 'number' ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
          />
        </Grid>
        <Grid>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            sx={{
              width: 42,
            }}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
render(<InputSlider />)`;

const colorsCode = `<Stack direction='column' spacing={2} sx={{ mb: 1, alignItems: 'center' }}>
  <Slider aria-label="Volume" defaultValue={30} />
  <Slider aria-label="Volume" defaultValue={60} color="secondary" />
  <Slider aria-label="Volume" defaultValue={45} color="info" />
  <Slider aria-label="Volume" defaultValue={75} color="success" />
  <Slider aria-label="Volume" defaultValue={35} color="warning" />
  <Slider aria-label="Volume" defaultValue={38} color="error" />
  <Slider aria-label="Volume" defaultValue={50} color="neutral" />
</Stack>`;

const verticalSliderCode = `const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

const VerticalAccessibleSlider = () => {
  const preventHorizontalKeyboardNavigation = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
    }
  }

  return (
    <Stack spacing={1} sx={{ height: 300, justifyContent: 'center' }}>
      <Slider
        orientation="vertical"
        defaultValue={30}
        aria-label="Temperature"
        valueLabelDisplay="auto"
        onKeyDown={preventHorizontalKeyboardNavigation}
      />
      <Slider
        orientation="vertical"
        defaultValue={30}
        aria-label="Temperature"
        valueLabelDisplay="auto"
        onKeyDown={preventHorizontalKeyboardNavigation}
        disabled
      />
      <Slider
        getAriaLabel={() => 'Temperature'}
        orientation="vertical"
        defaultValue={30}
        valueLabelDisplay="auto"
        defaultValue={[20, 37]}
        onKeyDown={preventHorizontalKeyboardNavigation}
        marks={marks}
      />
    </Stack>
  );
};
render(<VerticalAccessibleSlider />)`;

const marksPlacementCode = `const MAX = 100;
const MIN = 0;
const marks = [
  {
    value: MIN,
    label: '',
  },
  {
    value: MAX,
    label: '',
  },
];

const CustomMarks = () => {
  const [val, setVal] = useState(MIN);
  const handleChange = (_, newValue) => {
    setVal(newValue);
  };

  return (
    <Box sx={{ width: 250 }}>
      <Slider
        marks={marks}
        step={10}
        value={val}
        valueLabelDisplay="auto"
        min={MIN}
        max={MAX}
        onChange={handleChange}
      />
      <Stack sx={{ justifyContent: 'space-between' }}>
        <Typography
          variant="body2"
          onClick={() => setVal(MIN)}
          sx={{ cursor: 'pointer' }}
        >
          {MIN} min
        </Typography>
        <Typography
          variant="body2"
          onClick={() => setVal(MAX)}
          sx={{ cursor: 'pointer' }}
        >
          {MAX} max
        </Typography>
      </Stack>
    </Box>
  );
}
render(<CustomMarks />)`;

const removedTrackCode = `const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

const valuetext = (value) => {
  return \`\${value}°C\`;
}

const TrackFalseSlider = () => {
  return (
    <Box sx={{ width: 250 }}>
      <Typography id="track-false-slider" gutterBottom>
        Removed track
      </Typography>
      <Slider
        track={false}
        aria-labelledby="track-false-slider"
        getAriaValueText={valuetext}
        defaultValue={30}
        marks={marks}
      />
      <Typography id="track-false-range-slider" gutterBottom sx={{ mt: 3 }}>
        Removed track range slider
      </Typography>
      <Slider
        track={false}
        aria-labelledby="track-false-range-slider"
        getAriaValueText={valuetext}
        defaultValue={[20, 37, 50]}
        marks={marks}
      />
    </Box>
  );
}
render(<TrackFalseSlider />)`;

const invertedTrackCode = `const marks = [
  {
    value: 0,
    label: '0°C',
  },
  {
    value: 20,
    label: '20°C',
  },
  {
    value: 37,
    label: '37°C',
  },
  {
    value: 100,
    label: '100°C',
  },
];

const valuetext = (value) => {
  return \`\${value}°C\`;
}

const TrackInvertedSlider = () => {
  return (
    <Box sx={{ width: 250 }}>
      <Typography id="track-inverted-slider" gutterBottom>
        Inverted track
      </Typography>
      <Slider
        track="inverted"
        aria-labelledby="track-inverted-slider"
        getAriaValueText={valuetext}
        defaultValue={30}
        marks={marks}
      />
      <Typography id="track-inverted-range-slider" gutterBottom sx={{ mt: 3 }}>
        Inverted track range
      </Typography>
      <Slider
        track="inverted"
        aria-labelledby="track-inverted-range-slider"
        getAriaValueText={valuetext}
        defaultValue={[20, 37]}
        marks={marks}
      />
    </Box>
  );
}
render(<TrackInvertedSlider />)`;

const nonLinearScaleCode = `const valueLabelFormat = (value) => {
  const units = ['KB', 'MB', 'GB', 'TB'];

  let unitIndex = 0;
  let scaledValue = value;

  while (scaledValue >= 1024 && unitIndex < units.length - 1) {
    unitIndex += 1;
    scaledValue /= 1024;
  }

  return \`\${scaledValue} \${units[unitIndex]}\`;
}

const calculateValue = (value) => {
  return 2 ** value;
}

const NonLinearSlider = () => {
  const [value, setValue] = useState(10);

  const handleChange = (event, newValue) => {
    if (typeof newValue === 'number') {
      setValue(newValue);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="non-linear-slider" gutterBottom>
        Storage: {valueLabelFormat(calculateValue(value))}
      </Typography>
      <Slider
        value={value}
        min={5}
        step={1}
        max={30}
        scale={calculateValue}
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        onChange={handleChange}
        valueLabelDisplay="auto"
        aria-labelledby="non-linear-slider"
      />
    </Box>
  );
}
render(<NonLinearSlider />)`;

const SliderDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Slider',
        description: 'Sliders allow users to make selections from a range of values.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Slider',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-slider`,
        folderLink: `${folderBaseLink}/SliderDoc.jsx`,
      }}
    >
      <DocSection
        title="Continuous sliders"
        description="Continuous sliders allow users to select a value along a subjective range."
      >
        <DocCard code={continuousSlidersCode} />
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
            Sliders are <Code>medium</Code> sized by default. For smaller slider, use the prop{' '}
            <Code>size="small"</Code>.
          </Typography>
        }
      >
        <DocCard code={sliderSizesCode} />
      </DocSection>
      <DocSection
        title="Discrete sliders"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            Discrete sliders can be adjusted to a specific value by referencing its value indicator.
            You can generate a mark for each step with <Code>marks={`true`}</Code>.
          </Typography>
        }
      >
        <DocCard code={discreteSlidersCode} sx={{ mb: 4 }} />
        <DocNestedSection title="Small steps" id={kebabCase('Small steps')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can change the default step increment. Make sure to adjust the{' '}
            <Code>shiftStep</Code> prop (the granularity with which the slider can step when using
            Page Up/Down or Shift + Arrow Up/Down) to a value divadable with the <Code>step</Code>.
          </Typography>

          <DocCard code={smallStepsCode} sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Custom marks" id={kebabCase('Custom marks')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can have custom marks by providing a rich array to the <Code>marks</Code> prop.
          </Typography>
          <DocCard code={customMarksCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Restricted values" id={kebabCase('Restricted values')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can restrict the selectable values to those provided with the <Code>marks</Code>{' '}
            prop with <Code>{`step={null}`}</Code>.
          </Typography>
          <DocCard code={restrictedValuesCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Label always visible" id={kebabCase('Label always visible')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can force the thumb label to be always visible with{' '}
            <Code>valueLabelDisplay="on"</Code>.
          </Typography>
          <DocCard code={labelAlwaysVisibleCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Range slider"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The slider can be used to set the start and end of a range by supplying an array of
            values to the <Code>value</Code> prop.
          </Typography>
        }
      >
        <DocCard code={rangeCode} noInline sx={{ mb: 4 }} />
        <DocNestedSection title="Minimum distance" id={kebabCase('Minimum distance')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can enforce a minimum distance between values in the <Code>onChange</Code> event
            handler. By default, when you move the pointer over a thumb while dragging another
            thumb, the active thumb will swap to the hovered thumb. You can disable this behavior
            with the <Code>disableSwap</Code> prop. If you want the range to shift when reaching
            minimum distance, you can utilize the <Code>activeThumb</Code> parameter in{' '}
            <Code>onChange</Code>.
          </Typography>
          <DocCard code={minimumDistanceCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Slider with input field"
        description="In this example, an input allows a discrete value to be set."
      >
        <DocCard code={sliderWithInputFieldCode} noInline />
      </DocSection>
      <DocSection title="Color">
        <DocCard code={colorsCode} />
      </DocSection>
      <DocSection title="Vertical sliders">
        <DocCard code={verticalSliderCode} noInline />
      </DocSection>
      <DocSection
        title="Marks placement"
        description="You can customize your slider by adding and repositioning marks for minimum and maximum values."
      >
        <DocCard code={marksPlacementCode} noInline />
      </DocSection>
      <DocSection
        title="Track"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 2,
            }}
          >
            The track shows the range available for user selection.
          </Typography>
        }
      >
        <DocNestedSection title="Removed track" id={kebabCase('Removed track')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The track can be turned off with <Code>{`track={false}`}</Code>
          </Typography>
          <DocCard code={removedTrackCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Inverted track" id={kebabCase('Inverted track')}>
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            The track can be inverted with <Code>track="inverted"</Code>
          </Typography>
          <DocCard code={invertedTrackCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Non-linear scale"
        descriptionEl={
          <>
            <Typography
              variant="body1"
              sx={{
                mb: 2,
              }}
            >
              You can use the <Code>scale</Code> prop to represent the <Code>value</Code> on a
              different scale.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 5,
              }}
            >
              In the following demo, the value <em>x</em> represents the value <em>2^x</em>.
              Increasing <em>x</em> by one increases the represented value by factor <em>2</em>.
            </Typography>
          </>
        }
      >
        <DocCard code={nonLinearScaleCode} noInline />
      </DocSection>
    </DocPageLayout>
  );
};

export default SliderDoc;
