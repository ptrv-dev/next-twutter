'use client';

import { Session } from 'next-auth';
import { FC, useState } from 'react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { toast } from './ui/use-toast';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';

interface Props {
  session: Session;
  user: {
    id: number;
    followedBy: { id: number }[];
  };
}

const UserFollowButton: FC<Props> = ({ session, user }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFollow = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/user/${user.id}/follow`);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Cannot follow this user, please try again later..',
      });
    } finally {
      setLoading(false);
    }
  };

  const onUnfollow = async () => {
    setLoading(true);
    try {
      await axios.post(`/api/user/${user.id}/unfollow`);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: 'Cannot unfollow this user, please try again later..',
      });
    } finally {
      setLoading(false);
    }
  };

  return user.followedBy.findIndex(
    (follow) => follow.id === session.user.id
  ) !== -1 ? (
    <Button
      className="flex items-center gap-2"
      variant="destructive"
      onClick={onUnfollow}
    >
      {loading && <Loader2Icon className="animate-spin" size={16} />}
      Unfollow
    </Button>
  ) : (
    <Button className="flex items-center gap-2" onClick={onFollow}>
      {loading && <Loader2Icon className="animate-spin" size={16} />}
      Follow
    </Button>
  );
};

export default UserFollowButton;
