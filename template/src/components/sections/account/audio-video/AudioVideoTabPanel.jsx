import { Divider, Stack } from '@mui/material';
import AccountTabPanelSection from '../common/AccountTabPanelSection';
import CameraSettings from './CameraSettings';
import MicrophoneSpeaker from './MicrophoneSpeaker';
import Preferences from './Preferences';

const AudioVideoTabPanel = () => {
  return (
    <Stack direction="column" divider={<Divider />} spacing={5}>
      <AccountTabPanelSection
        title="Camera"
        subtitle="Adjust camera settings for optimal video quality during calls and meetings."
        icon="material-symbols:video-camera-front-outline-rounded"
      >
        <CameraSettings />
      </AccountTabPanelSection>
      <AccountTabPanelSection
        title="Microphone"
        subtitle="Configure microphone settings for clear audio during calls and meetings."
        icon="material-symbols:mic-outline-rounded"
      >
        <MicrophoneSpeaker />
      </AccountTabPanelSection>
      <AccountTabPanelSection
        title="When joining a meeting"
        subtitle="Set preferences for audio and video when joining a meeting."
        icon="material-symbols:group-outline"
      >
        <Preferences />
      </AccountTabPanelSection>
    </Stack>
  );
};

export default AudioVideoTabPanel;
