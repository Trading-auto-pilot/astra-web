/* eslint-disable no-irregular-whitespace */
import CodeBlock from 'components/common/CodeBlock';
import DocPageLayout from 'components/docs/DocPageLayout';
import DocSection from 'components/docs/DocSection';

const structureCode = `
├── src                           # Main source code directory
│   ├── assets                    # Static assets like images, fonts, json and icons
│   ├── components                # Reusable UI components
│   │   ├── base                  # Basic components used throughout the app
│   │   ├── common                # Commonly used components shared across multiple features
│   │   ├── docs                  # Components related to documentation pages
│   │   ├── guard                 # Route guard components for authentication and access control
│   │   ├── icons                 # Custom icons or icon components
│   │   ├── loading               # Components for loading indicators
│   │   ├── sections              # Larger sections of the app, possibly layout sections
│   │   ├── settings-panel        # Components related to the settings panel UI
│   │   └── styled                # Styled components or components using Mui styled-components
│   │   └── ...                   
│   ├── data                      # Static data or JSON files used in the app
│   ├── docs                      # Documentation pages and related components
│   │   ├── component-docs        # Pages documenting various components
│   │   ├── documentation         # General documentation pages
│   │   ├── routes                # Route definitions and configurations for docs
│   ├── helpers                   # Utility functions and helpers
│   ├── hooks                     # Custom React hooks
│   ├── layouts                   # Layout components defining the structure of different pages
│   │   ├── auth-layout           # Layouts specific to authentication pages
│   │   ├── ecommerce-layout      # Layouts specific to e-commerce pages
│   │   ├── email-layout          # Layouts specific to email pages
│   │   └── main-layout           # Main layout used across the application
│   ├── lib                       # Library or third-party utility functions
│   ├── locales                   # Localization files and configurations
│   ├── pages                     # Page components corresponding to different routes
│   │   ├── apps                  # Application-specific pages
│   │   ├── authentication        # Pages related to user authentication
│   │   ├── dashboards            # Dashboard pages
│   │   ├── errors                # Error pages (e.g., 404, 500)
│   │   ├── events                # Event-related pages
│   │   ├── misc                  # Miscellaneous pages
│   │   ├── pricing               # Pricing-related pages
│   │   └── others                # Miscellaneous pages
│   ├── providers                 # Context providers and related logic
│   ├── reducers                  # Reducers for managing global state with useReducer
│   ├── routes                    # Route definitions and configurations
│   │   ├── paths.js              # Defines the paths used throughout the application
│   │   ├── router.jsx            # Main routing configuration, setting up routes and components
│   │   └── sitemap.js            # Generates or manages the sitemap for the application
│   ├── services                  # Handles API integrations and configurations
│   │   ├── axios                 # Axios-related configurations and utilities
│   │   ├── configuration         # Configuration settings for data fetching library(SWR)
│   │   ├── firebase              # Firebase service initialization and configuration
│   │   └── swr                   # SWR (stale-while-revalidate) related utilities and hooks
│   │       ├── api-hooks         # Custom hooks for API calls using SWR
│   │       ├── ...
│   ├── theme                     # Handles theme customization and styling
│   │   ├── components            # Contains files for individual MUI overrided component
│   │   ├── palette               # Contains color variables and custom palette for both light and dark themes
│   │   ├── styles                # Custom styles for MUI and third-party library components
│   │   └── theme.js              # Main file where the MUI theme is created, with overall theme custom settings
│   │   └── ...
│   └── types                     # TypeScript type definitions
├── ...
`;

const FolderStructure = () => {
  return (
    <DocPageLayout
      pageHeaderProps={{
        title: 'Folder Structure',
      }}
    >
      <DocSection title="Project Tree" hideTitle>
        <CodeBlock code={structureCode} />
      </DocSection>
    </DocPageLayout>
  );
};

export default FolderStructure;
