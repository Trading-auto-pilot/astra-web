import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';
import { applicationDetailsSchema } from './steps/ApplicationDetails';
import { hiringTeamSchema } from './steps/HiringTeam';
import { jobBoardSchema } from './steps/JobBoard';
import { jobInformationFormSchema } from './steps/JobInformation';

const newOpeningFormSchema = [
  jobInformationFormSchema,
  applicationDetailsSchema,
  null,
  hiringTeamSchema,
  jobBoardSchema,
];

const useNewOpeningForm = (activeStep) => {
  const methods = useForm({
    resolver: newOpeningFormSchema[activeStep]
      ? yupResolver(newOpeningFormSchema[activeStep])
      : undefined,
    defaultValues: {
      jobInformation,
      candidateData,
      options,
      hiringManager,
      teamMember,
      boards,
    },
  });

  return methods;
};

export default useNewOpeningForm;

// Default values
const jobInformation = {
  jobTitle: '',
  positionNumber: 1,
  department: 'Support',
  hiringLead: 'Michael Hall',
  branch: 'UK',
  experience: 1,
  deadline: dayjs().format(),
  compensation: {
    currency: 'AUD',
    salary: 1800,
    interval: 'weekly',
  },
};

const candidateData = {
  name: true,
  email: true,
  phoneNo: true,
};

const options = {
  image: 'required',
  address: 'optional',
  referredBy: 'disabled',
  desiredSalary: 'required',
  resume: 'required',
  coverLetter: 'optional',
  websitePortfolio: 'optional',
  education: 'required',
  workExperience: 'required',
};

const hiringManager = {
  employee: 'Jack Smith',
  department: 'Data & Analytics',
};
const teamMember = [
  {
    employee: 'Michael Hall',
    department: 'Support',
  },
  {
    employee: 'Grace Wong',
    department: 'Sales',
  },
];
const boards = {
  linkedIn: true,
  indeed: false,
  facebook: false,
};
