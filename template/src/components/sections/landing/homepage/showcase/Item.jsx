import Stack from '@mui/material/Stack';
import { useBreakpoints } from 'providers/BreakpointsProvider';
import DashedLine from '../../common/DashedLine';
import { doubleFadedStyle, leftFadedStyle, rightFadedStyle } from '../../common/styles';
import ShowcaseItemDesc from './ItemDesc';
import ShowcaseItemImg from './ItemImage';

const ShowcaseItem = ({ isLeft = true, item, sx }) => {
  const { up } = useBreakpoints();

  const upMd = up('md');

  if (isLeft)
    return (
      <Wrapper isLeft={isLeft} sx={{ ...sx }}>
        <ShowcaseItemDesc
          title={item.title}
          subtitle={item.subtitle}
          desc={item.desc}
          sx={upMd ? { ...leftFadedStyle(5) } : { ...doubleFadedStyle() }}
        />
        <ShowcaseItemImg
          src={item.img}
          sx={upMd ? { ...rightFadedStyle() } : { ...doubleFadedStyle() }}
        />
      </Wrapper>
    );

  return (
    <Wrapper isLeft={isLeft} sx={{ ...sx }}>
      <ShowcaseItemImg
        src={item.img}
        sx={upMd ? { ...leftFadedStyle() } : { ...doubleFadedStyle() }}
      />
      <ShowcaseItemDesc
        title={item.title}
        subtitle={item.subtitle}
        desc={item.desc}
        sx={upMd ? { ...rightFadedStyle(5) } : { ...doubleFadedStyle() }}
      />
    </Wrapper>
  );
};

const Wrapper = ({ isLeft = false, children, sx }) => {
  return (
    <Stack
      direction={{ xs: isLeft ? 'column-reverse' : 'column', md: 'row' }}
      maxHeight={{ xs: 604, md: 342 }}
      sx={{
        position: 'relative',
        ...sx,
      }}
    >
      <DashedLine
        gradientOrientation="none"
        sx={{
          width: 1,
          zIndex: 20,
          position: 'absolute',
          top: 0,
        }}
      />
      {children}
      <DashedLine
        gradientOrientation="none"
        sx={{
          width: 1,
          zIndex: 20,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </Stack>
  );
};

export default ShowcaseItem;
