'use client';
import { User } from '@/types/user';
import { BasicInfo } from './components/basic-info';
import { useState } from 'react';
import { uploadFileToS3 } from '@/utils/s3Upload';
import APIClient from '@/utils/apiClient';
import { toast } from 'react-toastify';
import { toastMessages } from '@/utils/toastMessage';
import { decodeJWT } from '@/utils/auth';
import { setCookie } from 'nookies';
import { useUser } from '@/components/user-context';
import MyPosts from './components/myPosts';
import { PostType } from '../posts/types';

export interface MyProfileProps {
  user: User;
  posts: PostType[];
  nextToken: string;
}

export const MyProfile: React.FC<MyProfileProps> = ({
  user,
  posts,
  nextToken,
}: MyProfileProps) => {
  const { updateUser } = useUser();
  const [currentUser, setUser] = useState(user);
  const handleUserChange = async (u: User, avatar: File | null) => {
    const submitProfile = async () => {
      let avatarUrl;

      if (avatar) {
        const response = await (await fetch(`/api/getAvatarUrl`)).json();
        avatarUrl = await uploadFileToS3(response.url, avatar);
      }

      // send to server
      const client = new APIClient();

      const updatedUser = { ...u, avatar: avatarUrl ?? u.avatar };

      const res = await client.post('my/profile', updatedUser);

      setUser(updatedUser);

      return res;
    };

    const res = await toast.promise(
      submitProfile(),
      {
        success: toastMessages.UPDATE_SUCCESS,
        pending: toastMessages.UPDATE_LOADING,
        error: toastMessages.UPDATE_ERROR,
      },
      { position: 'top-center' }
    );

    if (res.Authorization) {
      setCookie(null, 'Authorization', res.Authorization);
      updateUser(decodeJWT(res.Authorization));
    }
  };
  return (
    <div>
      <BasicInfo user={currentUser} onChange={handleUserChange} />
      <MyPosts posts={posts} nextToken={nextToken} />
    </div>
  );
};
