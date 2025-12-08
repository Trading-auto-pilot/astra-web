import { useFieldArray, useFormContext } from 'react-hook-form';
import Grid from '@mui/material/Grid';
import BackgroundOptionItem from './BackgroundOptionItem';
import CustomOption from './CustomOption';

const BackgroundOptions = ({ type, actionButton, name }) => {
  const { setValue, watch, control } = useFormContext();
  const backgroundOptions = watch('backgroundOptions');

  const { fields, append, update } = useFieldArray({
    control,
    name: `backgroundOptions.${name}`,
    keyName: 'fieldId',
  });

  const handleClick = (option) => {
    setValue('backgroundOptions.selected', { ...option, type });
  };

  const handleCustomOptionChange = (background) => {
    const options = backgroundOptions[name];
    const customBgIndex = options.findIndex((item) => item.label === 'custom');

    if (customBgIndex === -1) {
      append({
        id: fields.length + 1,
        label: 'custom',
        background,
        type,
      });
    } else {
      update(customBgIndex, {
        ...fields[customBgIndex],
        background,
      });
    }
  };

  return (
    <Grid container spacing={3}>
      {fields.map((option) => {
        return (
          <Grid size={6} key={option.id} sx={{ height: 100 }}>
            <BackgroundOptionItem
              backgroundOption={option}
              type={type}
              selected={
                backgroundOptions.selected?.type === type &&
                option.id === backgroundOptions.selected?.id
              }
              onClick={handleClick}
            />
          </Grid>
        );
      })}
      <CustomOption type={type} onChange={handleCustomOptionChange} actionButton={actionButton} />
    </Grid>
  );
};

export default BackgroundOptions;
