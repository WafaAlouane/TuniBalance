import React, { useState } from 'react';
import {
  useGetFriendsQuery,
  useAcceptFriendRequestMutation,
  useRejectFriendRequestMutation,
} from '../../services/friendRequestApi';
import { User, Check, X, Clock } from 'react-feather';
import FriendsLayout from './FriendsLayout';

interface Friend {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  friendRequestId: string;
}

const ReceivedRequests = () => {
  const { data: friends = [], isLoading } = useGetFriendsQuery();
  const [accept] = useAcceptFriendRequestMutation();
  const [reject] = useRejectFriendRequestMutation();
  const [actionStates, setActionStates] = useState<Record<string, { loading: boolean; action?: 'accept' | 'reject' }>>({});

  const handleAccept = async (friendRequestId: string) => {
    setActionStates(prev => ({
      ...prev,
      [friendRequestId]: { loading: true, action: 'accept' }
    }));

    try {
      await accept(friendRequestId).unwrap();
      // Success state will be shown briefly before the item disappears
      setTimeout(() => {
        setActionStates(prev => ({
          ...prev,
          [friendRequestId]: { loading: false, action: 'accept' }
        }));
      }, 500);
    } catch (error) {
      setActionStates(prev => ({
        ...prev,
        [friendRequestId]: { loading: false }
      }));
      console.error('Error accepting friend request:', error);
    }
  };

  const handleReject = async (friendRequestId: string) => {
    setActionStates(prev => ({
      ...prev,
      [friendRequestId]: { loading: true, action: 'reject' }
    }));

    try {
      await reject(friendRequestId).unwrap();
      // Success state will be shown briefly before the item disappears
      setTimeout(() => {
        setActionStates(prev => ({
          ...prev,
          [friendRequestId]: { loading: false, action: 'reject' }
        }));
      }, 500);
    } catch (error) {
      setActionStates(prev => ({
        ...prev,
        [friendRequestId]: { loading: false }
      }));
      console.error('Error rejecting friend request:', error);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <div className="animate-pulse flex flex-col items-center max-w-md mx-auto w-full">
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="h-16 bg-gray-700 rounded w-full mb-3"></div>
            <div className="h-16 bg-gray-700 rounded w-full"></div>
          </div>
          <p className="mt-4 text-gray-400 font-medium">Loading friend requests...</p>
        </div>
      );
    }

    if (friends.length === 0) {
      return (
        <div className="p-6 bg-gray-800 rounded-md shadow border border-gray-700 text-center">
          <div className="w-12 h-12 mx-auto mb-4 text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-300 mb-2">No friend requests</h3>
          <p className="text-gray-400 mb-4">When someone sends you a friend request, it will appear here</p>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            Find Friends
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Friend Requests</h2>
          <span className="px-2.5 py-1 bg-blue-900 text-blue-200 text-xs font-medium rounded-full">
            {friends.filter(f => !(actionStates[f.friendRequestId]?.action && !actionStates[f.friendRequestId]?.loading)).length}
          </span>
        </div>

        <div className="bg-gray-800 rounded-md shadow border border-gray-700 overflow-hidden">
          {friends.map((friend: Friend) => {
            const state = actionStates[friend.friendRequestId] || { loading: false };

            // If the action is completed, don't render this item
            if (state.action && !state.loading) return null;

            return (
              <div
                key={friend.friendRequestId}
                className="p-4 border-b border-gray-700 last:border-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden ring-1 ring-gray-600">
                      {friend.avatarUrl ? (
                        <img
                          src={`http://localhost:5000${friend.avatarUrl}`}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User size={20} className="text-gray-400" />
                      )}
                    </div>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-gray-800"></span>
                  </div>
                  <div>
                    <p className="font-semibold text-white">{friend.name}</p>
                    <p className="text-sm text-gray-400">{friend.email}</p>
                    <div className="text-xs text-yellow-500 mt-1 flex items-center">
                      <Clock size={12} className="mr-1" />
                      Pending request
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {state.loading ? (
                    <div className="flex items-center justify-center px-3 py-1.5 rounded bg-gray-700">
                      <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full"></div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAccept(friend.friendRequestId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        <Check size={14} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(friend.friendRequestId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        <X size={14} />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <FriendsLayout title="Friend Requests">
      {renderContent()}
    </FriendsLayout>
  );
};

export default ReceivedRequests;
