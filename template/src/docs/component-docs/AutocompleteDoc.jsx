import {
  Autocomplete,
  Box,
  Grid,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { folderBaseLink, muiComponentBaseLink } from 'lib/constants';
import { kebabCase } from 'lib/utils';
import Code from 'components/base/Code';
import IconifyIcon from 'components/base/IconifyIcon';
import CountrySelect from 'components/common/CountrySelect';
import DocCard from 'components/docs/DocCard';
import DocNestedSection from 'components/docs/DocNestedSection';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';
import StyledTextField from 'components/styled/StyledTextField';

const comboboxCode = `const ComboBox = () => {
  return (
    <Stack spacing={2} direction={{xs: 'column', sm: 'row', md: 'column', lg: 'row' }}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top10Films}
        sx={{ width: 1, maxWidth: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top10Films}
        sx={{ width: 1, maxWidth: 300 }}
        renderInput={(params) => <StyledTextField {...params} label="Movie" />}
      />
    </Stack>
  );
}
render(<ComboBox />);

const top10Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  {
    label: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
];`;

const playgroundCode = `const Playground = () => {
  const defaultProps = {
    options: top10Films,
    getOptionLabel: (option) => option.title,
  };
  const flatProps = {
    options: top10Films.map((option) => option.title),
  };
  const [value, setValue] = useState(null);

  return (
    <Stack direction="column" spacing={1} sx={{ width: 1, maxWidth: 300 }}>
      <Autocomplete
        {...defaultProps}
        id="disable-close-on-select"
        disableCloseOnSelect
        renderInput={(params) => (
          <TextField {...params} label="disableCloseOnSelect" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="clear-on-escape"
        clearOnEscape
        renderInput={(params) => (
          <TextField {...params} label="clearOnEscape" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disable-clearable"
        disableClearable
        renderInput={(params) => (
          <TextField {...params} label="disableClearable" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="include-input-in-list"
        includeInputInList
        renderInput={(params) => (
          <TextField {...params} label="includeInputInList" />
        )}
      />
      <Autocomplete
        {...flatProps}
        id="flat-demo"
        renderInput={(params) => (
          <TextField {...params} label="flat" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="controlled-demo"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="controlled" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="auto-complete"
        autoComplete
        includeInputInList
        renderInput={(params) => (
          <TextField {...params} label="autoComplete" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disable-list-wrap"
        disableListWrap
        renderInput={(params) => (
          <TextField {...params} label="disableListWrap" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="open-on-focus"
        openOnFocus
        renderInput={(params) => (
          <TextField {...params} label="openOnFocus" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="auto-highlight"
        autoHighlight
        renderInput={(params) => (
          <TextField {...params} label="autoHighlight" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="auto-select"
        autoSelect
        renderInput={(params) => (
          <TextField {...params} label="autoSelect" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disabled"
        disabled
        renderInput={(params) => (
          <TextField {...params} label="disabled" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="disable-portal"
        disablePortal
        renderInput={(params) => (
          <TextField {...params} label="disablePortal" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="blur-on-select"
        blurOnSelect
        renderInput={(params) => (
          <TextField {...params} label="blurOnSelect" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="clear-on-blur"
        clearOnBlur
        renderInput={(params) => (
          <TextField {...params} label="clearOnBlur" />
        )}
      />
      <Autocomplete
        {...defaultProps}
        id="select-on-focus"
        selectOnFocus
        renderInput={(params) => (
          <TextField {...params} label="selectOnFocus" />
        )}
      />
      <Autocomplete
        {...flatProps}
        id="readOnly"
        readOnly
        defaultValue={flatProps.options[13]}
        renderInput={(params) => (
          <TextField {...params} label="readOnly" />
        )}
      />
    </Stack>
  );
}

render(<Playground />);

const top10Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const countrySelectCode = `import CountrySelect from 'components/common/CountrySelect';

<CountrySelect
  onChange={(event, value) => {
    console.log({ value });
  }}
  sx={{ width: 300 }}
  fields={{ flag: true, name: true, phone: true, code: true }}
  renderInput={(params) => <TextField {...params} label="Choose a country" />}
/>`;

const controlledStatesCode = `const options = ['Option 1', 'Option 2'];

const ControllableStates = () => {
  const [value, setValue] = useState(options[0]);
  const [inputValue, setInputValue] = useState('');

  return (
    <div>
      <div>{\`value: \${value !== null ? \`'\${value}'\` : 'null'}\`}</div>
      <div>{\`inputValue: '\${inputValue}'\`}</div>
      <br />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={options}
        sx={{ width: 1, maxWidth: 300 }}
        renderInput={(params) => <TextField {...params} label="Controllable" />}
      />
    </div>
  );
}
render(<ControllableStates />)`;

const freeSoloSearchInputCode = `const FreeSolo = () => {
  return (
    <Stack spacing={2} direction={{ xs:'column', sm:'row'}} sx={{ maxWidth: { xs:300, sm:600} }}>
        <Autocomplete
          fullWidth
          id="free-solo-demo"
          freeSolo
          options={topFilms.map((option) => option.title)}
          renderInput={(params) => <TextField {...params} label="Free solo" />}
        />
        <Autocomplete
          fullWidth
          freeSolo
          id="free-solo-2-demo"
          disableClearable
          options={topFilms.map((option) => option.title)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search input"
              slotProps={{
                input: {
                  ...params.InputProps,
                  type: "search",
                },
              }}
            />
          )}
        />
    </Stack>
  );
}
render(<FreeSolo />);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const creatableFreeSoloTextCode = `const filter = createFilterOptions();

const FreeSoloCreateOption = () => {
  const [value, setValue] = useState(null);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          setValue({
            title: newValue,
          });
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          });
        } else {
          setValue(newValue);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.title);
        if (inputValue !== '' && !isExisting) {
          filtered.push({
            inputValue,
            title: \`Add "\${inputValue}"\`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={topFilms}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.title}
          </li>
        );
      }}
      sx={{ width: 1, maxWidth: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label="Free solo with text demo" />
      )}
    />
  );
}
render(<FreeSoloCreateOption />);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const creatableFreeSoloDialogCode = `const filter = createFilterOptions();

const FreeSoloCreateOptionDialog = () => {
  const [value, setValue] = useState(null);
  const [open, toggleOpen] = useState(false);

  const handleClose = () => {
    setDialogValue({
      title: '',
      year: '',
    });
    toggleOpen(false);
  };

  const [dialogValue, setDialogValue] = useState({
    title: '',
    year: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue({
      title: dialogValue.title,
      year: parseInt(dialogValue.year, 10),
    });
    handleClose();
  };

  return (
    <Fragment>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === 'string') {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                title: newValue,
                year: '',
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              title: newValue.inputValue,
              year: '',
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              inputValue: params.inputValue,
              title: \`Add "\${params.inputValue}"\`,
            });
          }

          return filtered;
        }}
        id="free-solo-dialog-demo"
        options={topFilms}
        getOptionLabel={(option) => {
          // for example value selected with enter, right from the input
          if (typeof option === 'string') {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.title;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <li key={key} {...optionProps}>
              {option.title}
            </li>
          );
        }}
        sx={{ width: 1, maxWidth: 300 }}
        freeSolo
        renderInput={(params) => <TextField {...params} label="Free solo dialog" />}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add a new film</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Did you miss any film in our list? Please, add it!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.title}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  title: event.target.value,
                })
              }
              label="title"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.year}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  year: event.target.value,
                })
              }
              label="year"
              type="number"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}
render(<FreeSoloCreateOptionDialog />);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const groupedCode = `const Grouped = () => {
  const options = topFilms.map((option) => {
    const firstLetter = option.title[0].toUpperCase();
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? '0-9' : firstLetter,
      ...option,
    };
  });

  return (
    <Autocomplete
      id="grouped-demo"
      options={options.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
      groupBy={(option) => option.firstLetter}
      getOptionLabel={(option) => option.title}
      sx={{ width: 1, maxWidth: 300 }}
      renderInput={(params) => <TextField {...params} label="With categories" />}
    />
  );
}
render(<Grouped />);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const disabledOptionsCode = `const DisabledOptions = () => {
  return (
    <Autocomplete
      id="disabled-options-demo"
      options={timeSlots}
      getOptionDisabled={(option) =>
        option === timeSlots[0] || option === timeSlots[2]
      }
      sx={{ width: 1, maxWidth: 300 }}
      renderInput={(params) => <TextField {...params} label="Disabled options" />}
    />
  );
}
render(<DisabledOptions />);

// One time slot every 30 minutes.
const timeSlots = Array.from(new Array(24 * 2)).map(
  (_, index) =>
    \`\${index < 20 ? '0' : ''}\${Math.floor(index / 2)}:\${
      index % 2 === 0 ? '00' : '30'
    }\`,
);`;

const asyncLoadOnOpenCode = `const sleep = (duration) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const Asynchronous = () => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      await sleep(1e3); // For demo purposes.

      if (active) {
        setOptions([...topFilms]);
      }
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      sx={{ width: 1, maxWidth: 300 }}
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}filterOptions={(x) => x}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Asynchronous"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }
          }}
        />
      )}
    />
  );
}
render(<Asynchronous />)

const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const tagsCode = `const Tags = () => {
  return (
    <Stack direction="column" spacing={3} sx={{ width: 1, maxWidth: 500 }}>
      <Autocomplete
        multiple
        id="tags-outlined"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={[topFilms[1]]}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label="filterSelectedOptions"
            placeholder="Favorites"
          />
        )}
      />
      <Autocomplete
        multiple
        id="tags-filled"
        options={topFilms.map((option) => option.title)}
        defaultValue={[topFilms[1].title]}
        freeSolo
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip variant="outlined" label={option} key={key} {...tagProps} />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="filled"
            label="freeSolo"
            placeholder="Favorites"
          />
        )}
      />
      <Autocomplete
        multiple
        id="tags-readOnly"
        options={topFilms.map((option) => option.title)}
        defaultValue={[topFilms[3].title, topFilms[5].title]}
        readOnly
        renderInput={(params) => (
          <TextField {...params} label="readOnly" placeholder="Favorites" />
        )}
      />
    </Stack>
  );
}
render(<Tags />);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const fixedTagsCode = `const FixedTags = () => {
  const fixedOptions = [topFilms[6]];
  const [value, setValue] = useState([...fixedOptions, topFilms[1]]);

  return (
    <Autocomplete
      multiple
      id="fixed-tags-demo"
      value={value}
      onChange={(event, newValue) => {
        setValue([
          ...fixedOptions,
          ...newValue.filter((option) => fixedOptions.indexOf(option) === -1),
        ]);
      }}
      options={topFilms}
      getOptionLabel={(option) => option.title}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => {
          const { key, ...tagProps } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option.title}
              {...tagProps}
              disabled={fixedOptions.indexOf(option) !== -1}
            />
          );
        })
      }
      sx={{ width: 1, maxWidth: 500 }}
      renderInput={(params) => (
        <TextField {...params} label="Fixed tag" placeholder="Favorites" />
      )}
    />
  );
}
render(<FixedTags />)

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const checkboxesCode = `const CheckboxesTags = () => {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={topFilms}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            <Checkbox
              sx={{ mr: 1 }}
              checked={selected}
            />
            {option.title}
          </li>
        );
      }}
      sx={{ width: 1, maxWidth: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Checkboxes" placeholder="Favorites" />
      )}
    />
  );
}
render(<CheckboxesTags />)

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const limitTagsCode = `const LimitTags = () => {
  return (
    <Autocomplete
      multiple
      limitTags={2}
      id="multiple-limit-tags"
      options={topFilms}
      getOptionLabel={(option) => option.title}
      defaultValue={[topFilms[1], topFilms[2], topFilms[5]]}
      renderInput={(params) => (
        <TextField {...params} label="limitTags" placeholder="Favorites" />
      )}
      sx={{ width: 1, maxWidth: 500 }}
    />
  );
}
render(<LimitTags />);

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const sizesCode = `const Sizes = () => {
  return (
    <Stack direction="column" spacing={2} sx={{ width: 1, maxWidth: 500 }}>
      <Autocomplete
        id="size-small-outlined"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={topFilms[7]}
        renderInput={(params) => (
          <TextField {...params} label="Size medium" placeholder="Favorites" />
        )}
      />
      <Autocomplete
        multiple
        id="size-small-outlined-multi"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={[topFilms[9]]}
        renderInput={(params) => (
          <TextField {...params} label="Size medium" placeholder="Favorites" />
        )}
      />
      <Autocomplete
        id="size-small-filled"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={topFilms[5]}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="outlined"
                label={option.title}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Size medium"
            placeholder="Favorites"
          />
        )}
      />
      <Autocomplete
        multiple
        id="size-small-filled-multi"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={[topFilms[6]]}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="outlined"
                label={option.title}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Size medium"
            placeholder="Favorites"
          />
        )}
      />
      <Autocomplete
        id="size-small-outlined"
        size="small"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={topFilms[7]}
        renderInput={(params) => (
          <TextField {...params} label="Size small" placeholder="Favorites" />
        )}
      />
      <Autocomplete
        multiple
        id="size-small-outlined-multi"
        size="small"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={[topFilms[9]]}
        renderInput={(params) => (
          <TextField {...params} label="Size small" placeholder="Favorites" />
        )}
      />
      <Autocomplete
        id="size-small-filled"
        size="small"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={topFilms[5]}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="outlined"
                label={option.title}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Size small"
            placeholder="Favorites"
          />
        )}
      />
      <Autocomplete
        multiple
        id="size-small-filled-multi"
        size="small"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={[topFilms[6]]}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="outlined"
                label={option.title}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Size small"
            placeholder="Favorites"
          />
        )}
      />
      <Autocomplete
        id="size-small-custom"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        size="small"
        defaultValue={topFilms[7]}
        renderInput={(params) => (
          <StyledTextField {...params} label="Size small" placeholder="Favorites" />
        )}
      />
      <Autocomplete
        multiple
        id="size-small-custom-multi"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={[topFilms[9]]}
        renderInput={(params) => (
          <StyledTextField {...params} label="Size medium" placeholder="Favorites" />
        )}
      />
      <Autocomplete
        id="size-small-custom"
        options={topFilms}
        getOptionLabel={(option) => option.title}
        defaultValue={topFilms[5]}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                variant="outlined"
                label={option.title}
                {...tagProps}
              />
            );
          })
        }
        renderInput={(params) => (
          <StyledTextField
            {...params}
            label="Size large"
            size="large"
            placeholder="Favorites"
          />
        )}
      />
    </Stack>
  );
}
render(<Sizes />)

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { title: 'The Good, the Bad and the Ugly', year: 1966 },
  { title: 'Fight Club', year: 1999 },
];`;

const AutocompleteDoc = () => {
  const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
    {
      label: 'The Lord of the Rings: The Return of the King',
      year: 2003,
    },
  ];

  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Autocomplete',
        description:
          'The autocomplete is a normal text input enhanced by a panel of suggested options.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'Autocomplete',
          },
        ],
        docLink: `${muiComponentBaseLink}/react-autocomplete`,
        folderLink: `${folderBaseLink}/AutocompleteDoc.jsx`,
      }}
    >
      <DocSection title="Combo box">
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="small"
              options={top100Films}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => <TextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => <TextField {...params} size="large" label="Movie" />}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="small"
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="User ID or Email address"
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="large"
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="large"
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="small"
              options={top100Films}
              renderInput={(params) => <StyledTextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => <StyledTextField {...params} label="Movie" />}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => <StyledTextField {...params} size="large" label="Movie" />}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="small"
              options={top100Films}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  placeholder="User ID or Email address"
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="large"
              options={top100Films}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  size="large"
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="small"
              options={top100Films}
              renderInput={(params) => (
                <TextField {...params} size="small" variant="outlined" label="Movie" />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => <TextField {...params} variant="outlined" label="Movie" />}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="large"
              options={top100Films}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" size="large" label="Movie" />
              )}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="small"
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  variant="outlined"
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
          <Grid size={4}>
            <Autocomplete
              disablePortal
              size="large"
              options={top100Films}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  size="large"
                  label="Movie"
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconifyIcon icon="material-symbols:account-circle" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <DocCard code={comboboxCode} noInline scope={{ StyledTextField }} sx={{ mb: 5 }} />
        <DocNestedSection title="Playground" id={kebabCase('Playground')}>
          <DocCard code={playgroundCode} noInline sx={{ mb: 5 }} />
        </DocNestedSection>

        <DocNestedSection title="Country select" id={kebabCase('Country select')}>
          <DocCard code={countrySelectCode} scope={{ CountrySelect }} sx={{ mb: 5 }} />
        </DocNestedSection>

        <DocNestedSection title="Controlled states" id={kebabCase('Controlled states')}>
          <Box sx={{ mb: 5, color: 'text.secondary' }}>
            <Typography variant="body1">
              The component has two states that can be controlled:
            </Typography>
            <ol>
              <li>
                <Typography variant="body1">
                  the "value" state with the <Code>value</Code>/<Code>onChange</Code> props
                  combination. This state represents the value selected by the user, for instance
                  when pressing <Code>Enter</Code>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  the "input value" state with the <Code>inputValue</Code>/
                  <Code>onInputChange</Code> props combination. This state represents the value
                  displayed in the textbox.
                </Typography>
              </li>
            </ol>
            <Typography variant="body1">
              These two states are isolated and should be controlled independently.
            </Typography>
          </Box>
          <DocCard code={controlledStatesCode} noInline />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Free solo"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 2,
            }}
          >
            Set <Code>freeSolo</Code> to true so the textbox can contain any arbitrary value.
          </Typography>
        }
      >
        <DocNestedSection title="Search Input" id={kebabCase('Search Input')}>
          <DocCard code={freeSoloSearchInputCode} noInline />
        </DocNestedSection>

        <DocNestedSection title="Creatable" id={kebabCase('Creatable')} sx={{ mt: 4 }}>
          <Typography
            variant="body1"
            sx={{
              mb: 2,
            }}
          >
            If you intend to use this mode for a <Link href="#combo-box">combo box</Link> like
            experience (an enhanced version of a select element) we recommend setting:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">
                <Code>selectOnFocus</Code> to help the user clear the selected value.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Code>clearOnBlur</Code> to help the user enter a new value.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <Code>handleHomeEndKeys</Code> to move focus inside the popup with the{' '}
                <Code>Home</Code> and <Code>End</Code> keys.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                A last option, for instance: <Code>Add "YOUR SEARCH"</Code>.
              </Typography>
            </li>
          </ul>
          <DocCard code={creatableFreeSoloTextCode} noInline sx={{ my: 4 }} />
          <Typography
            variant="body1"
            sx={{
              mb: 4,
            }}
          >
            You could also display a <Code>Dialog</Code> when the user wants to add a new value.
          </Typography>
          <DocCard code={creatableFreeSoloDialogCode} noInline />
        </DocNestedSection>
      </DocSection>
      <DocSection
        title="Grouped"
        descriptionEl={
          <Typography
            variant="body1"
            sx={{
              mb: 5,
            }}
          >
            You can group the options with the <Code>groupBy</Code> prop.
          </Typography>
        }
      >
        <DocCard code={groupedCode} noInline />
      </DocSection>
      <DocSection title="Disabled options">
        <DocCard code={disabledOptionsCode} noInline />
      </DocSection>
      <DocSection title="Asynchronous requests">
        <DocCard code={asyncLoadOnOpenCode} noInline />
      </DocSection>
      <DocSection title="Multiple values">
        <DocCard code={tagsCode} noInline sx={{ mb: 4 }} />

        <DocNestedSection title="Fixed options" id={kebabCase('Fixed options')}>
          <DocCard code={fixedTagsCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Checkboxes" id={kebabCase('Checkboxes')}>
          <DocCard code={checkboxesCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>

        <DocNestedSection title="Limit tags" id={kebabCase('Limit tags')}>
          <Typography
            variant="body1"
            sx={{
              mb: 3,
            }}
          >
            You can use the <Code>limitTags</Code> prop to limit the number of displayed options
            when not focused.
          </Typography>
          <DocCard code={limitTagsCode} noInline sx={{ mb: 4 }} />
        </DocNestedSection>
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
            Use the <Code>size="small"</Code> prop smaller inputs. Default is <Code>medium</Code>.
          </Typography>
        }
      >
        <DocCard code={sizesCode} noInline scope={{ StyledTextField }} />
      </DocSection>
    </DocPageLayout>
  );
};

export default AutocompleteDoc;
