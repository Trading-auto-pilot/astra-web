import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useAccounts } from 'providers/AccountsProvider';
import AccountTabPanelSection from 'components/sections/account/common/AccountTabPanelSection';
import ManageStorage from './ManageStorage';
import SavedtoStorage from './SavedtoStorage';

const StorageTabPanel = () => {
  const { storage } = useAccounts();
  const { backupSyncSettings, storageData } = storage;

  return (
    <Stack direction="column" divider={<Divider />} spacing={5}>
      <AccountTabPanelSection
        title="Manage Storage"
        subtitle="Effortlessly manage accurate time settings and adjustments for precise, reliable timekeeping across all time zones."
        icon="material-symbols:database-outline"
      >
        <ManageStorage storageData={storageData} />
      </AccountTabPanelSection>

      <AccountTabPanelSection
        title="Saved to Storage"
        subtitle="Effortlessly manage accurate time settings and adjustments for precise, reliable timekeeping across all time zones."
        icon="material-symbols:backup-outline-rounded"
      >
        <SavedtoStorage backupSyncSettings={backupSyncSettings} storageData={storageData} />
      </AccountTabPanelSection>
    </Stack>
  );
};

export default StorageTabPanel;
