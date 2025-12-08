import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useGSAP } from '@gsap/react';
import { Box, Link, keyframes } from '@mui/material';
import { showcaseAssets } from 'data/showcase';
import gsap from 'gsap';
import paths from 'routes/paths';
import FloatingButton from './FloatingButton';
import PulseOverlay from './PulseOverlay';
import { buildPreviewUrl, getLayoutConfig, getLayoutPosition } from './layoutConfigUtils';

const spin = keyframes`to { transform: rotate(360deg); }`;

const LayoutPreview = ({ isDark }) => {
  const { watch } = useFormContext();
  const previewRef = useRef(null);
  const buttonRef = useRef(null);

  const config = watch();
  const previewUrl = buildPreviewUrl(config, isDark, paths.ecommerce);
  const backgroundImage = `url(${isDark ? showcaseAssets.customizeLayout.dark : showcaseAssets.customizeLayout.light})`;
  const backgroundPosition = `${getLayoutPosition(config)} top`;

  useGSAP(
    () => {
      const preview = previewRef.current;
      const button = buttonRef.current;
      if (!preview || !button) return;

      gsap.fromTo(preview, { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out' });

      const onMove = (e) => {
        const rect = preview.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left - 60, rect.width - 120));
        const y = Math.max(0, Math.min(e.clientY - rect.top - 60, rect.height - 120));

        gsap.killTweensOf(button);
        gsap.set(button, { left: x, top: y });
        gsap.to(button, { scale: 1, opacity: 1, duration: 0.3 });
      };

      const onLeave = () => {
        gsap.killTweensOf(button);
        gsap.to(button, { scale: 0, opacity: 0, duration: 0.15 });
      };

      preview.addEventListener('mousemove', onMove);
      preview.addEventListener('mouseleave', onLeave);

      return () => {
        preview.removeEventListener('mousemove', onMove);
        preview.removeEventListener('mouseleave', onLeave);
      };
    },
    { dependencies: [backgroundImage, backgroundPosition] },
  );

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'grey.950',
        overflow: 'hidden',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          left: '-50%',
          top: '-50%',
          backgroundImage: 'conic-gradient(transparent 20%, #fff 35%, transparent 50%)',
          animation: `${spin} 12s linear infinite`,
        },
        '&::after': { animationDelay: '-6s' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 5,
          zIndex: 10,
          bgcolor: isDark ? 'grey.950' : 'common.white',
        }}
      />

      <Box
        ref={previewRef}
        sx={{
          position: 'absolute',
          zIndex: 10,
          inset: 4,
          backgroundImage,
          backgroundSize: '1500% auto',
          backgroundPosition,
        }}
      >
        <Link
          href={previewUrl}
          target="_blank"
          underline="none"
          sx={{ position: 'absolute', inset: 0 }}
        />
        <FloatingButton isDark={isDark} ref={buttonRef} />
        <PulseOverlay layoutConfig={getLayoutConfig(config)} />
      </Box>
    </Box>
  );
};

export default LayoutPreview;
