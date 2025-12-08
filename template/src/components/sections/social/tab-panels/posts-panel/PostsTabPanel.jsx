import { useState } from 'react';
import { profileData } from 'data/social';
import Post from './post/Post';
import CreatePost from './post/create-post/CreatePost';

const PostsTabPanel = () => {
  const [posts, setPosts] = useState(profileData.posts);

  return (
    <>
      <CreatePost posts={posts} setPosts={setPosts} />

      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};

export default PostsTabPanel;
