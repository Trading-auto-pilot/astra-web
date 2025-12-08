import React from 'react';
import { LiveProvider as ReactLiveProvider } from 'react-live';
import * as mui from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';

const LiveProvider = ({ children, code, noInline, scope, disabled, transformCode }) => {
  const theme = mui.useTheme();

  return (
    <ReactLiveProvider
      code={code}
      disabled={disabled}
      scope={{ ...mui, ...React, IconifyIcon, ...scope }}
      noInline={noInline}
      transformCode={transformCode ? transformCode : (code) => code.replace(/^import.*$/gm, '')}
      language="jsx"
      theme={{
        plain: {
          color: theme.vars.palette.text.primary,
          backgroundColor: theme.vars.palette.background.elevation2,
        },
        styles: [
          {
            types: ['prolog', 'constant', 'builtin'],
            style: {
              color: theme.vars.palette.error.main,
            },
          },
          {
            types: ['inserted', 'function', 'operator'],
            style: {
              color: theme.vars.palette.primary.main,
            },
          },
          {
            types: ['deleted'],
            style: {
              color: theme.vars.palette.error.main,
            },
          },
          {
            types: ['changed'],
            style: {
              color: theme.vars.palette.warning.main,
            },
          },
          {
            types: ['punctuation', 'symbol'],
            style: {
              color: theme.vars.palette.text.primary,
            },
          },
          {
            types: ['string', 'char', 'selector', 'attr-value', 'property'],
            style: {
              color: theme.vars.palette.success.main,
            },
          },
          {
            types: ['keyword', 'variable', 'attr-equals', 'script-punctuation'],
            style: {
              color: theme.vars.palette.error.main,
            },
          },
          {
            types: ['comment'],
            style: {
              color: theme.vars.palette.info.main,
            },
          },
          {
            types: ['attr-name', 'tag', 'literal-property'],
            style: {
              color: theme.vars.palette.text.primary,
            },
          },
        ],
      }}
    >
      {children}
    </ReactLiveProvider>
  );
};

export default LiveProvider;
