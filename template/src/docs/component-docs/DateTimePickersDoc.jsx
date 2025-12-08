import {
  DatePicker,
  DateTimePicker,
  DesktopDatePicker,
  DesktopDateTimePicker,
  DesktopTimePicker,
  MobileDatePicker,
  MobileDateTimePicker,
  MobileTimePicker,
  StaticDatePicker,
  StaticDateTimePicker,
  StaticTimePicker,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { folderBaseLink, muiComponentXLink } from 'lib/constants';
import SimpleBar from 'components/base/SimpleBar';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const datePickersCode = `import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export const DatePicker = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
          'DesktopDatePicker',
          'MobileDatePicker',
          'StaticDatePicker',
        ]}
        sx={{ overflow: 'unset', p: 0 }}
      >
        <DemoItem label="Default variant">
          <DatePicker label="Select date" defaultValue={dayjs()} sx={{ maxWidth: 400 }} />
        </DemoItem>

        <DemoItem label="Desktop variant">
          <DesktopDatePicker
            label="Select date"
            defaultValue={dayjs()}
            sx={{ maxWidth: 400 }}
          />
        </DemoItem>

        <DemoItem label="Mobile variant">
          <MobileDatePicker
            label="Select date"
            defaultValue={dayjs()}
            sx={{ maxWidth: 400 }}
          />
        </DemoItem>

        <DemoItem label="Static variant">
          <StaticDatePicker
            defaultValue={dayjs()}
            orientation="landscape"
            sx={{ maxWidth: 552 }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
`;

const timePickersCode = `import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { StaticTimePicker } from '@mui/x-date-pickers/StaticTimePicker';


export const TimePickers = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'TimePicker',
          'TimePicker',
          'DesktopTimePicker',
          'MobileTimePicker',
          'StaticTimePicker',
        ]}
        sx={{
          overflow: 'unset',
          p: 0,
        }}
      >
        <DemoItem label="12 hours">
          <TimePicker
            label="Pick time"
            defaultValue={dayjs('2022-04-17T15:30')}
            sx={{ maxWidth: 400 }}
          />
        </DemoItem>

        <DemoItem label="24 hours">
          <TimePicker
            label="Pick time"
            defaultValue={dayjs('2022-04-17T15:30')}
            ampm={false}
            sx={{ maxWidth: 400 }}
          />
        </DemoItem>

        <DemoItem label="Desktop variant">
          <DesktopTimePicker
            label="Pick time"
            defaultValue={dayjs('2022-04-17T15:30')}
            sx={{ maxWidth: 400 }}
          />
        </DemoItem>

        <DemoItem label="Mobile variant">
          <MobileTimePicker
            label="Pick time"
            defaultValue={dayjs('2022-04-17T15:30')}
            sx={{ maxWidth: 400 }}
          />
        </DemoItem>

        <DemoItem label="Static variant">
          <StaticTimePicker
            defaultValue={dayjs('2022-04-17T15:30')}
            sx={{ width: 'min-content' }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
`;

const dateTimePickersCode = `import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';


export const DateTimePickers = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DateTimePicker', 
          'DesktopDateTimePicker', 
          'MobileDateTimePicker', 
          'StaticDateTimePicker'
        ]}
        sx={{
          overflow: 'unset',
          p: 0,
        }}
      >
        <DemoItem label="Default variant">
          <DatePicker 
            label="Select date" 
            defaultValue={dayjs()} 
            sx={{ maxWidth: 400 }} 
          />
        </DemoItem>

        <DemoItem label="Desktop variant">
          <DesktopDateTimePicker
            label="Select Date & Time"
            defaultValue={dayjs('2022-04-17T15:30')}
          />
        </DemoItem>

        <DemoItem label="Mobile variant">
          <MobileDateTimePicker
            label="Select Date & Time"
            defaultValue={dayjs('2022-04-17T15:30')}
          />
        </DemoItem>

        <DemoItem label="Static variant">
          <StaticDateTimePicker
            defaultValue={dayjs('2022-04-17T15:30')}
            sx={{ width: 'min-content' }}
          />
        </DemoItem>
      </DemoContainer>
    </LocalizationProvider>
  );
}
`;

const DateTimePickersDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Date & Time Pickers',
        description: 'The Date Picker component lets users select a date.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'DateTimePickers',
          },
        ],
        docLink: `${muiComponentXLink}/react-date-pickers/getting-started`,
        folderLink: `${folderBaseLink}/DateTimePickersDoc.jsx`,
      }}
    >
      <DocSection title="Date">
        <DocCard code={datePickersCode} hidePreview>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                'DatePicker',
                'DesktopDatePicker',
                'MobileDatePicker',
                'StaticDatePicker',
              ]}
              sx={{ overflow: 'unset', p: 0 }}
            >
              <DemoItem label="Default variant">
                <DatePicker label="Select date" defaultValue={dayjs()} sx={{ maxWidth: 400 }} />
              </DemoItem>

              <DemoItem label="Desktop variant">
                <DesktopDatePicker
                  label="Select date"
                  defaultValue={dayjs()}
                  sx={{ maxWidth: 400 }}
                />
              </DemoItem>

              <DemoItem label="Mobile variant">
                <MobileDatePicker
                  label="Select date"
                  defaultValue={dayjs()}
                  sx={{ maxWidth: 400 }}
                />
              </DemoItem>

              <DemoItem label="Static variant">
                <SimpleBar>
                  <StaticDatePicker
                    defaultValue={dayjs()}
                    orientation="portrait"
                    sx={{ width: 'min-content' }}
                  />
                </SimpleBar>
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </DocCard>
      </DocSection>

      <DocSection title="Time">
        <DocCard code={timePickersCode} hidePreview>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                'TimePicker',
                'TimePicker',
                'DesktopTimePicker',
                'MobileTimePicker',
                'StaticTimePicker',
              ]}
              sx={{
                overflow: 'unset',
                p: 0,
              }}
            >
              <DemoItem label="12 hours">
                <TimePicker label="Pick time" defaultValue={dayjs()} sx={{ maxWidth: 400 }} />
              </DemoItem>

              <DemoItem label="24 hours">
                <TimePicker
                  label="Pick time"
                  defaultValue={dayjs()}
                  ampm={false}
                  sx={{ maxWidth: 400 }}
                />
              </DemoItem>

              <DemoItem label="Desktop variant">
                <DesktopTimePicker
                  label="Pick time"
                  defaultValue={dayjs()}
                  sx={{ maxWidth: 400 }}
                />
              </DemoItem>

              <DemoItem label="Mobile variant">
                <MobileTimePicker label="Pick time" defaultValue={dayjs()} sx={{ maxWidth: 400 }} />
              </DemoItem>

              <DemoItem label="Static variant">
                <SimpleBar>
                  <StaticTimePicker defaultValue={dayjs()} sx={{ width: 'min-content' }} />
                </SimpleBar>
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </DocCard>
      </DocSection>

      <DocSection title="DateTime">
        <DocCard code={dateTimePickersCode} hidePreview>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={[
                'DateTimePicker',
                'DesktopDateTimePicker',
                'MobileDateTimePicker',
                'StaticDateTimePicker',
              ]}
              sx={{
                overflow: 'unset',
                p: 0,
              }}
            >
              <DemoItem label="Default variant">
                <DateTimePicker
                  label="Select Date & Time"
                  defaultValue={dayjs()}
                  sx={{ maxWidth: 400 }}
                />
              </DemoItem>

              <DemoItem label="Desktop variant">
                <DesktopDateTimePicker
                  label="Select Date & Time"
                  defaultValue={dayjs()}
                  sx={{ maxWidth: 400 }}
                />
              </DemoItem>

              <DemoItem label="Mobile variant">
                <MobileDateTimePicker
                  label="Select Date & Time"
                  defaultValue={dayjs()}
                  sx={{ maxWidth: 400 }}
                />
              </DemoItem>

              <DemoItem label="Static variant">
                <SimpleBar>
                  <StaticDateTimePicker defaultValue={dayjs()} sx={{ width: 'min-content' }} />
                </SimpleBar>
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </DocCard>
      </DocSection>
    </DocPageLayout>
  );
};

export default DateTimePickersDoc;
