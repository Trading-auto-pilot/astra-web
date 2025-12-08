import { Divider, Stack, Tooltip } from '@mui/material';
import { initialConfig } from 'config';
import { cssVarRgba } from 'lib/utils';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import { darkShadows } from 'theme/shadows';
import Image from 'components/base/Image';

const techLogos = [
  { src: `${initialConfig.assetsDir}/images/logo/12.svg`, title: 'JavaScript' },
  { src: `${initialConfig.assetsDir}/images/logo/13.svg`, title: 'TypeScript' },
  { src: `${initialConfig.assetsDir}/images/logo/14.svg`, title: 'Figma' },
  { src: `${initialConfig.assetsDir}/images/logo/15.svg`, title: 'Vite' },
];

const mainTechs = [
  { src: `${initialConfig.assetsDir}/images/logo/16.svg`, title: 'Nextjs 15' },
  { src: `${initialConfig.assetsDir}/images/logo/17.svg`, title: 'React 19' },
  { src: `${initialConfig.assetsDir}/images/logo/18.svg`, title: 'MUI v7' },
];

const TechStack = () => {
  const { up } = useBreakpoints();
  const size = up('sm') ? 30 : 22;

  return (
    <Stack
      divider={<Divider flexItem orientation="vertical" />}
      sx={({ vars }) => ({
        bgcolor: cssVarRgba(vars.palette.common.whiteChannel, 0.04),
        borderRadius: 3.5,
        p: 2,
        gap: { xs: 1, sm: 2 },
        boxShadow: darkShadows[0],
      })}
    >
      <Stack gap={{ xs: 1, sm: 1.5 }}>
        {techLogos.map(({ src, title }) => (
          <Tooltip key={title} title={title} placement="top">
            <Image src={src} width={size} height={size} />
          </Tooltip>
        ))}
      </Stack>

      {mainTechs.map(({ src, title }) => (
        <Tooltip key={title} title={title} placement="top">
          <Image src={src} height={size} />
        </Tooltip>
      ))}
    </Stack>
  );
};

export default TechStack;
