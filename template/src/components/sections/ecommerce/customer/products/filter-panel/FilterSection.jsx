import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Link,
  formControlLabelClasses,
} from '@mui/material';
import FilterCollapsiblePanel from './FilterCollapsiblePanel';

const FilterSection = ({ defaultOpen, title, options, name }) => {
  const [optionsLength, setOptionsLength] = useState(4);
  const [showMore, setShowMore] = useState(false);

  const handleSeeMoreClick = () => {
    setShowMore(!showMore);
    setOptionsLength(showMore ? 4 : options.length);
  };

  const { watch, register } = useFormContext();
  const values = watch();

  return (
    <FilterCollapsiblePanel defaultOpen={defaultOpen} title={title}>
      <FormGroup
        sx={{
          [`& .${formControlLabelClasses.label}`]: {
            fontWeight: 500,
          },
        }}
      >
        {options.slice(0, optionsLength).map((option) => (
          <FormControlLabel
            key={option.value}
            control={
              <Checkbox
                value={option.value}
                checked={values[name]?.includes(option.value) || false}
                {...register(name, {
                  value: [],
                })}
              />
            }
            label={option.label}
          />
        ))}

        {options.length > 4 && (
          <Link
            onClick={handleSeeMoreClick}
            sx={{
              color: 'text.secondary',
              mt: 2,
              width: 'fit-content',
              fontWeight: 'medium',
            }}
          >
            {showMore ? 'See less' : 'See more'}
          </Link>
        )}
      </FormGroup>
    </FilterCollapsiblePanel>
  );
};

export default FilterSection;
