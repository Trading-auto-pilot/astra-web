import { useRef } from 'react';
import { Box, toggleButtonClasses, useTheme } from '@mui/material';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import {
  MenuButtonAlignCenter,
  MenuButtonAlignJustify,
  MenuButtonAlignLeft,
  MenuButtonAlignRight,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonEditLink,
  MenuButtonImageUpload,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuControlsContainer,
  MenuDivider,
  RichTextEditor,
} from 'mui-tiptap';
import IconifyIcon from './IconifyIcon';

export const editorDefaultToolbar = (imageUploadHandler) => {
  const handleImageUpload = async (files) => {
    return imageUploadHandler
      ? imageUploadHandler(files)
      : files.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        }));
  };

  return (
    <MenuControlsContainer>
      <MenuButtonUndo
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:undo-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonRedo
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:redo-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuDivider />
      <MenuButtonBold
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-bold-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonItalic
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-italic-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonUnderline
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-underlined-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuDivider />
      <MenuButtonAlignLeft
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-align-left-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonAlignRight
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-align-right-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonAlignCenter
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-align-center-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonAlignJustify
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-align-justify-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuDivider />
      <MenuButtonBulletedList
        disabled={false}
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-list-bulleted-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonOrderedList
        disabled={false}
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:format-list-numbered-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuDivider />
      <MenuButtonImageUpload
        onUploadFiles={handleImageUpload}
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:imagesmode-outline-rounded"
            fontSize={20}
          />
        )}
      />
      <MenuButtonEditLink
        IconComponent={() => (
          <IconifyIcon
            sx={{ pointerEvents: 'none' }}
            icon="material-symbols:attachment-rounded"
            fontSize={20}
          />
        )}
      />
    </MenuControlsContainer>
  );
};

const Editor = (
  {
    onChange,
    isValid = true,
    placeholder = 'Write a description...',
    imageUploadHandler,
    extensions = [],
    sx,
    ...rest
  },
  ref,
) => {
  const defaultRef = useRef(null);
  const editorRef = ref || defaultRef;
  const theme = useTheme();

  const defaultExtensions = [
    StarterKit,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Underline,
    Image,
    Placeholder.configure({ placeholder }),
    ...extensions,
  ];

  return (
    <Box
      component={RichTextEditor}
      ref={editorRef}
      content=""
      extensions={defaultExtensions}
      renderControls={() => editorDefaultToolbar(imageUploadHandler)}
      onUpdate={({ editor }) => {
        const html = editor.getHTML();
        if (onChange) {
          onChange(editor.isEmpty ? '' : html);
        }
      }}
      sx={{
        bgcolor: !isValid ? 'error.lighter' : 'background.elevation2',
        overflow: 'hidden',
        borderRadius: 2,
        p: 0,
        '&:hover': {
          bgcolor: isValid ? 'background.elevation3' : undefined,
          '& .MuiTiptap-MenuBar-root': {
            bgcolor: !isValid ? 'error.lighter' : 'background.elevation3',
          },
          '& .MuiTiptap-FieldContainer-notchedOutline': {
            borderColor: !isValid ? 'error.main' : 'unset',
            borderWidth: !isValid ? 1 : undefined,
          },
        },
        '& .MuiTiptap-MenuBar-root': {
          bgcolor: !isValid ? 'error.lighter' : 'background.elevation2',
          border: 'none',
          [`& .${toggleButtonClasses.root}`]: {
            color: 'neutral.dark',
            [`&:hover, &.${toggleButtonClasses.selected}`]: {
              bgcolor: 'background.elevation4',
            },
            [`&.${toggleButtonClasses.disabled}`]: {
              opacity: 0.3,
            },
          },
        },
        '& .MuiTiptap-RichTextContent-root': {
          padding: theme.spacing(0, 2, 2, 2),

          '.tiptap': {
            minHeight: 236,
            maxHeight: 236,
            overflow: 'auto',
            '& p[data-placeholder]::before': {
              color:
                (!isValid ? theme.vars.palette.error.main : theme.vars.palette.text.disabled) +
                ' !important',
            },
          },
        },
        '&.MuiTiptap-FieldContainer-focused': {
          bgcolor: !isValid ? 'error.lighter' : 'primary.lighter',

          '& .MuiTiptap-MenuBar-root': {
            bgcolor: !isValid ? 'error.lighter' : 'primary.lighter',
          },

          '.MuiTiptap-FieldContainer-notchedOutline': {
            borderWidth: '1px !important',
            borderColor: !isValid ? 'error.main' : 'primary.main',
          },
        },
        '& .MuiTiptap-FieldContainer-notchedOutline': {
          borderWidth: !isValid ? 1 : 0,
          borderColor: !isValid ? 'error.main' : 'unset',
        },
        ...sx,
      }}
      {...rest}
    />
  );
};

Editor.displayName = 'Editor';

export default Editor;
