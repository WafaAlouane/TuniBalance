import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/types';

interface FriendRequest {
  _id: string;
  sender: {
    name: string;
    email: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
}

export const Notifications = () => {
  const requests = useSelector((state: RootState) => state.friendRequestApi?.queries['getFriendRequests']?.data) as FriendRequest[];

  useEffect(() => {
    if (requests?.length > 0) {
      const lastRequest = requests[requests.length - 1];

      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(() => {});

      alert(`New friend request: ${lastRequest.sender?.name || 'Someone'} sent you a request`);
    }
  }, [requests]);

  return null;
};

export default Notifications;
