import dayjs from 'dayjs';

export const fileManagerReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_FILE':
      return {
        ...state,
        allFiles: [...state.allFiles, action.payload],
      };
    case 'ADD_FOLDER':
      return {
        ...state,
        allFiles: [...state.allFiles, action.payload],
      };
    case 'SELECT_FILE':
      return {
        ...state,
        selectedFiles: [...state.selectedFiles, action.payload],
      };
    case 'DESELECT_FILE':
      return {
        ...state,
        selectedFiles: state.selectedFiles.filter((id) => id !== action.payload),
      };
    case 'SET_ALL_FILES':
      return {
        ...state,
        allFiles: action.payload,
      };

    case 'SELECT_ALL_FILES':
      return {
        ...state,
        selectedFiles: [...state.allFiles],
      };
    case 'DESELECT_ALL_FILES':
      return {
        ...state,
        selectedFiles: [],
      };
    case 'VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'SET_SORT_BY':
      return {
        ...state,
        sort: action.payload,
        allFiles: state.allFiles.sort((a, b) => {
          switch (action.payload) {
            case 'none':
              return a.id - b.id;
            case 'name':
              return a.name.localeCompare(b.name);
            case 'size':
              return a.size - b.size;
            case 'modified':
              return dayjs(a.modifiedAt).diff(dayjs(b.modifiedAt), 'second');
            case 'created':
              return dayjs(a.createdAt).diff(dayjs(b.createdAt), 'second');
          }
        }),
      };
    case 'TOGGLE_FAVORITE':
      return {
        ...state,
        allFiles: state.allFiles.map((file) =>
          file.id === action.payload ? { ...file, favorite: !file.favorite } : file,
        ),
      };
    case 'UPDATE_SHARED_WITH':
      return {
        ...state,
        allFiles: state.allFiles.map((file) =>
          file.id === action.payload.fileId ? { ...file, sharedWith: action.payload.users } : file,
        ),
      };
    case 'CHANGE_FOLDER_COLOR':
      return {
        ...state,
        allFiles: state.allFiles.map((file) =>
          file.id === action.payload.folderId ? { ...file, color: action.payload.color } : file,
        ),
      };
    default:
      return state;
  }
};
