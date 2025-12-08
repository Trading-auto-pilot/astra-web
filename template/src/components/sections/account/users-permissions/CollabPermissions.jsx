import { Controller, useFormContext } from 'react-hook-form';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

const CollabPermissions = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="collabPermission"
      render={({ field }) => (
        <RadioGroup defaultValue="anyone" {...field}>
          <FormControlLabel
            value="anyone"
            control={<Radio />}
            label="Anyone can send a collaborator request"
          />
          <FormControlLabel
            value="only_code"
            control={<Radio />}
            label="Only users with a request code can send collaborator invites."
          />
        </RadioGroup>
      )}
    />
  );
};

export default CollabPermissions;
