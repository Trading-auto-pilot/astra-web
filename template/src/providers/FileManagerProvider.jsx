import { createContext, use, useEffect, useReducer, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { files } from 'data/file-manager';
import dayjs from 'dayjs';
import { fileManagerReducer } from 'reducers/FileManagerReducer';

export const FileManagerContext = createContext({});

const initialState = {
  recentFiles: files.filter((file) => dayjs().diff(dayjs(file.uploadedAt), 'hour') <= 1),
  allFiles: files,
  selectedFiles: [],
  viewMode: 'grid',
  filter: 'all',
  sort: 'none',
};

const isFolder = (file) => file.type === 'folder';

const findFolderById = (folderArray, folderId) => {
  for (const file of folderArray) {
    if (isFolder(file) && file.id.toString() === folderId) {
      return file;
    }
    if (isFolder(file) && file.files) {
      const foundFolder = findFolderById(file.files, folderId);
      if (foundFolder) return foundFolder;
    }
  }

  return null;
};

const FileManagerProvider = ({ children }) => {
  const [fileManagerState, fileManagerDispatch] = useReducer(fileManagerReducer, initialState);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  const handleDrawer = (open) => {
    setIsSidebarOpen(open);
  };

  useEffect(() => {
    if (!id) {
      fileManagerDispatch({
        type: 'SET_ALL_FILES',
        payload: files,
      });
    } else {
      const folder = findFolderById(files, id);
      fileManagerDispatch({
        type: 'SET_ALL_FILES',
        payload: folder ? folder.files || [] : [],
      });
    }

    fileManagerDispatch({ type: 'DESELECT_ALL_FILES' });
  }, [id, location.pathname]);

  return (
    <FileManagerContext
      value={{
        ...fileManagerState,
        fileManagerDispatch,
        isSidebarOpen,
        handleDrawer,
      }}
    >
      {children}
    </FileManagerContext>
  );
};

export const useFileManager = () => use(FileManagerContext);

export default FileManagerProvider;
