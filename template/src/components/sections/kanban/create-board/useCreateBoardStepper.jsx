import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import {
  backgroundColorOptions,
  backgroundImageOptions,
  initialTeamTableData,
} from 'data/kanban/createBoard';
import { backgroundOptionFormSchema } from 'components/sections/kanban/create-board/steps/Background/Background';
import { basicInfoFormSchema } from 'components/sections/kanban/create-board/steps/BasicInfo';
import { columnInfoSchema } from 'components/sections/kanban/create-board/steps/ColumnStage/ColumnStage';
import { labelInfoFormSchema } from 'components/sections/kanban/create-board/steps/LabelInfo';
import { newTeamFormSchema } from 'components/sections/kanban/create-board/steps/TeamInvite/NewTeamTabPanel';

const validationSchemas = [
  basicInfoFormSchema,
  columnInfoSchema,
  backgroundOptionFormSchema,
  labelInfoFormSchema,
  newTeamFormSchema,
];

const useCreateBoardForm = (activeStep) => {
  const { palette } = useTheme();
  const methods = useForm({
    resolver: yupResolver(validationSchemas[activeStep]),
    defaultValues: {
      name: '',
      boardType: '',
      visibility: 'private',
      columns: [
        { columnType: 'To Do', color: palette.success.lighter, cardLimit: 20, hasCardLimit: true },
        {
          columnType: 'Completed',
          color: palette.primary.lighter,
          cardLimit: 20,
          hasCardLimit: true,
        },
        {
          columnType: 'Ongoing',
          color: palette.warning.lighter,
          cardLimit: 20,
          hasCardLimit: true,
        },
      ],
      backgroundOptions: {
        colors: backgroundColorOptions,
        images: backgroundImageOptions,
        selected: { ...backgroundImageOptions[0], type: 'image' },
      },
      labels: [
        { label: 'Todo', color: palette.success.lighter },
        { label: 'Completed', color: palette.primary.lighter },
        { label: 'Ongoing', color: palette.warning.lighter },
      ],
      team: initialTeamTableData,
    },
  });

  return methods;
};

export default useCreateBoardForm;
