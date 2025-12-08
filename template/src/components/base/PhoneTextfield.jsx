import { useEffect, useState } from 'react';
import { InputAdornment, Stack } from '@mui/material';
import { countries as countriesData } from 'data/countries';
import CountrySelect from 'components/common/CountrySelect';
import StyledTextField from 'components/styled/StyledTextField';
import IconifyIcon from './IconifyIcon';
import NumberTextField from './NumberTextField';

const PhoneTextfield = ({ countries = countriesData, onChange, defaultValue }) => {
  const [country, setCountry] = useState(countries[0]);
  const [phoneNo, setPhoneNo] = useState('');

  useEffect(() => {
    if (defaultValue) {
      const country = countries.find((country) => country.phone === defaultValue.code);

      setCountry(country || countries[0]);
      setPhoneNo(defaultValue.number);
    }
  }, []);

  return (
    <Stack
      spacing={1}
      sx={{
        mb: '1px',
      }}
      alignItems="center"
    >
      <CountrySelect
        onChange={(event, value) => {
          if (value) {
            setCountry(value);
          }
          if (onChange) {
            onChange(`(+${value?.phone})${phoneNo}`);
          }
        }}
        options={countries}
        value={country}
        getOptionLabel={(option) => {
          return `+${option.phone}`;
        }}
        fields={{ flag: true, name: false, phone: true, code: false }}
        disableClearable
        forcePopupIcon={false}
        renderInput={(params) => {
          return (
            <StyledTextField
              {...params}
              sx={{
                minWidth: 90,
                '& .MuiInputBase-root': {
                  pl: '8px !important',
                  '& .MuiInputBase-input': {
                    px: '0 !important',
                  },
                },
              }}
              slotProps={{
                input: {
                  ...params.InputProps,
                  startAdornment: country ? (
                    <InputAdornment position="start">
                      <IconifyIcon icon={country?.flag} sx={{ width: 24 }} />
                    </InputAdornment>
                  ) : undefined,
                },
              }}
              size="large"
            />
          );
        }}
        slotProps={{
          popper: {
            sx: {
              '& .MuiAutocomplete-option': {
                pl: '8px !important',
                pr: '8px !important',
                fontSize: 14,
              },
            },
          },
        }}
      />
      <NumberTextField
        variant="custom"
        size="large"
        fullWidth
        value={phoneNo}
        onChange={(e) => {
          setPhoneNo(e.target.value);
          if (onChange) {
            onChange(`(+${country?.phone})${e.target.value}`, e);
          }
        }}
      />
    </Stack>
  );
};

export default PhoneTextfield;
