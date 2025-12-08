import { folderBaseLink } from 'lib/constants';
import DateRangePicker from 'components/base/DateRangePicker';
import DocCard from 'components/docs/DocCard';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const basicDateRangePickerCode = `import DateRangePicker from 'components/base/DateRangePicker';
export const BasicDatePicker = () => {
  return (
    <DateRangePicker />
  );
}
`;

const dateRangePickerWithClearCode = `import DateRangePicker from 'components/base/DateRangePicker';
export const BasicDatePicker = () => {
  return (
    <DateRangePicker isClearable={true} />
  );
}
`;
const dateRangePickerWithPortalCode = `import DateRangePicker from 'components/base/DateRangePicker';
export const BasicDatePicker = () => {
  return (
    <DateRangePicker withPortal />
  );
}
`;

const DateRangePickerDoc = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Date Range Picker',
        description: 'A simple and reusable datepicker component for React.',
        breadcrumbs: [
          {
            label: 'Docs',
            url: '#!',
          },
          {
            label: 'DateRangePicker',
          },
        ],
        docLink: 'https://reactdatepicker.com/',
        docLinkLabel: 'React Datepicker Docs',
        folderLink: `${folderBaseLink}/DateRangePickerDoc.jsx`,
      }}
    >
      <DocSection title="Basic">
        <DocCard code={basicDateRangePickerCode} hidePreview>
          <DateRangePicker sx={{ maxWidth: 400 }} />
        </DocCard>
      </DocSection>

      <DocSection title="With Clear Button">
        <DocCard code={dateRangePickerWithClearCode} hidePreview>
          <DateRangePicker isClearable={true} sx={{ maxWidth: 400 }} />
        </DocCard>
      </DocSection>

      <DocSection title="With Portal">
        <DocCard code={dateRangePickerWithPortalCode} hidePreview>
          <DateRangePicker withPortal sx={{ maxWidth: 400 }} />
        </DocCard>
      </DocSection>
    </DocPageLayout>
  );
};

export default DateRangePickerDoc;
