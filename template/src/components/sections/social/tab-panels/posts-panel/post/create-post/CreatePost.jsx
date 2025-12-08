import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { profileData } from 'data/social';
import dayjs from 'dayjs';
import { generateUniqueId } from 'lib/utils';
import { useSnackbar } from 'notistack';
import EmojiPicker from 'components/base/EmojiPicker';
import IconifyIcon from 'components/base/IconifyIcon';
import AddMedia from './AddMedia';
import TextInput from './TextInput';

const CreatePost = ({ posts, setPosts }) => {
  const methods = useForm();
  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;
  const { enqueueSnackbar } = useSnackbar();

  const textValue = watch('text');
  const attachmentsValue = watch('attachments');
  const handleEmojiSelect = (native) => {
    setValue('text', textValue ? textValue + native : native);
  };

  const onSubmit = (data) => {
    console.log(data);
    const getAttachments = () => ({
      media: (data.attachments ?? [])
        .filter((a) => ['image', 'video'].includes(a.type))
        .map(({ file }) => ({
          type: file.type.split('/')[0],
          src: URL.createObjectURL(file),
        })),
    });

    const mediaFiles = getAttachments().media;

    const newPost = {
      id: generateUniqueId(),
      author: {
        ...profileData,
        id: Math.floor(Math.random() * (9999 - 100 + 1)) + 100,
      },
      message: {
        text: data.text,
        attachments: mediaFiles && mediaFiles,
      },
      createdAt: dayjs().format('YYYY-MM-DD h:mm a'),
      engagement: {
        likes: 0,
        comments: 0,
        shares: 0,
      },
      comments: [],
      type: 'post',
    };
    setPosts([newPost, ...posts]);
    enqueueSnackbar('Post created!', { variant: 'success', autoHideDuration: 4000 });
  };

  useEffect(() => {
    reset();
  }, [isSubmitSuccessful]);

  return (
    <FormProvider {...methods}>
      <Stack spacing={2}>
        <Avatar
          src={profileData.avatar}
          alt="comment-author-avatar"
          sx={{ width: 32, height: 32 }}
        />
        <Stack
          direction="column"
          spacing={2}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: 1 }}
        >
          <TextInput />
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack>
              <AddMedia />
              <EmojiPicker
                handleEmojiSelect={handleEmojiSelect}
                actionButtonEle={
                  <Tooltip title="Emoji">
                    <Button shape="square" color="neutral">
                      <IconifyIcon icon="material-symbols:mood-outline-rounded" fontSize={20} />
                    </Button>
                  </Tooltip>
                }
              />
              <Tooltip title="Record Video">
                <Button shape="square" color="neutral">
                  <IconifyIcon icon="material-symbols:videocam-outline-rounded" fontSize={20} />
                </Button>
              </Tooltip>
            </Stack>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!textValue?.trim() && (!attachmentsValue || attachmentsValue.length === 0)}
              sx={{ maxWidth: 120 }}
            >
              Post
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

export default CreatePost;
