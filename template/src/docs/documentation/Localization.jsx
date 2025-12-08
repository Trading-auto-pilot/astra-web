import { Link, ListItem, Typography, listItemClasses } from '@mui/material';
import Code from 'components/base/Code';
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection, { DocList, DocSubtitle } from 'components/docs/DocSection';

const Localization = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Localization',
        descriptionEl: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aurora provides robust <strong>localization</strong> support using{' '}
            <Link href="https://www.i18next.com/" target="_blank">
              i18next
            </Link>{' '}
            and{' '}
            <Link href="https://react.i18next.com/" target="_blank">
              react-i18next
            </Link>{' '}
            libraries. This enables multi-language support with features such as currency
            formatting, locale-specific content, and dynamic language switching.
          </Typography>
        ),
      }}
    >
      <DocSection title="Key Files and Configuration">
        <DocList
          sx={{
            listStyleType: 'decimal',
            [`& .${listItemClasses.root}`]: {
              py: 1,
            },
          }}
        >
          <ListItem>
            <DocSubtitle sx={{ mb: 1 }}>Supported Languages</DocSubtitle>

            <Typography sx={{ mb: 1 }}>
              Defined in <Code>src/locales/languages.js</Code>, this file contains an array of
              supported languages, including labels, locale codes, and currency details.
            </Typography>
            <Typography>Example Code:</Typography>
            <CodeBlock
              sx={{ mt: 1 }}
              code={`export const languages = [
  { label: 'English', locale: 'en-US', currency: 'USD', currencySymbol: '$' },
  { label: 'বাংলা', locale: 'bn-BD', currency: 'BDT', currencySymbol: '৳' },
  // Other languages...
];`}
            />
          </ListItem>
          <ListItem>
            <DocSubtitle sx={{ mb: 1 }}>i18n Initialization</DocSubtitle>
            <Typography sx={{ mb: 1 }}>
              The i18next configuration resides in <Code>src/locales/i18n.js</Code>. It initializes
              language detection, fallback locales, and resource files.
            </Typography>
            <Typography>Example Code:</Typography>
            <CodeBlock
              sx={{ mt: 1 }}
              code={`i18n.init({
  resources: {
    enUS: { translation: translationEn },
    bnBD: { translation: translationBn },
  },
  fallbackLng: 'en',
});`}
            />
          </ListItem>
          <ListItem>
            <DocSubtitle sx={{ mb: 1 }}>Translation Files</DocSubtitle>
            <Typography>
              Language-specific JSON files are stored in
              <Code>src/locales/langs/</Code>. File names match the locale codes (e.g.,{' '}
              <Code>en.json</Code>, <Code>bn.json</Code>).
            </Typography>
          </ListItem>
        </DocList>
      </DocSection>
      <DocSection title="Changing the Locale">
        <Typography>
          To dynamically change the active locale, dispatch the <Code>SET_LOCALE</Code> action with
          the desired locale.
        </Typography>
        <CodeBlock
          sx={{ mt: 1 }}
          code={`const { configDispatch } = useSettingsContext();

configDispatch({
  type: SET_LOCALE,
  payload: 'bn-BD', // Change to Bengali
});`}
        />
      </DocSection>
      <DocSection title="Usage in Components">
        <Typography>
          Use the <Code>useTranslation</Code> hook to access translated content:
        </Typography>
        <CodeBlock
          sx={{ mt: 1 }}
          code={`import { useTranslation } from 'react-i18next';

const ExampleComponent = () => {
  const { t } = useTranslation();

  return <div>{t('welcome')}</div>; // Displays "Welcome" in the current locale
};`}
        />
      </DocSection>
      <DocSection title="Number and Currency Formatting">
        <Typography sx={{ mb: 2 }}>
          Aurora provides a <Code>useNumberFormat</Code> hook located in{' '}
          <Code>src/hooks/useNumberFormat.jsx</Code> for formatting numbers and currency values
          dynamically based on the selected locale and currency.
        </Typography>
        <DocSubtitle sx={{ mb: 1 }}>Key Features</DocSubtitle>
        <DocList
          sx={{
            mb: 1,
            listStyleType: 'decimal',
            [`& .${listItemClasses.root}`]: {
              py: 1,
            },
          }}
        >
          <ListItem>
            <DocSubtitle sx={{ mb: 1 }}>Dynamic Locale and Currency: </DocSubtitle>

            <Typography sx={{ mb: 1 }}>
              The hook retrieves the active locale from the <Code>SettingsProvider</Code> and
              matches it with supported languages defined in <Code>locales/languages.js</Code>.
            </Typography>
          </ListItem>
          <ListItem>
            <DocSubtitle sx={{ mb: 1 }}>Methods Provided:</DocSubtitle>
            <DocList>
              <ListItem>
                <Code>currencyFormat</Code>: Formats a number as currency according to
                locale-specific rules. Requires an amount (number) and accepts{' '}
                <Link
                  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options"
                  target="_blank"
                >
                  Intl.NumberFormatOptions
                </Link>{' '}
                as an optional parameter for custom formatting.
              </ListItem>
              <ListItem>
                <Code>numberFormat</Code>: Formats a number according to locale-specific rules.
                Requires an amount (number) and accepts{' '}
                <Link
                  href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options"
                  target="_blank"
                >
                  Intl.NumberFormatOptions
                </Link>{' '}
                as an optional parameter for custom formatting.
              </ListItem>
              <ListItem>
                <Code>currencySymbol</Code>: Retrieves the currency symbol of the active locale.
              </ListItem>
            </DocList>
          </ListItem>
        </DocList>
        <DocSubtitle sx={{ mb: 1 }}>Example Usage</DocSubtitle>
        <CodeBlock
          code={`const { currencyFormat, numberFormat, currencySymbol } = useNumberFormat();

// Example usage
console.log(currencyFormat(1234.56)); 
// Output: "$1,234.56" (for 'en-US' locale)

console.log(currencyFormat(1234.56, { style: 'currency', currency: 'EUR' })); 
// Output: "€1,234.56"

console.log(numberFormat(9876543.21)); 
// Output: "9,876,543.21" (formatted for the locale)

console.log(currencySymbol); 
// Output: "$" (currency symbol based on the current locale)
`}
        />
      </DocSection>
    </DocPageLayout>
  );
};

export default Localization;
