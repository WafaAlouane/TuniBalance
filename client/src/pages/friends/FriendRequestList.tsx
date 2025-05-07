import React from 'react';
import { useSelector } from 'react-redux';
import { useGetMyFriendRequestsQuery, useGetFriendsQuery } from '../../services/friendRequestApi';
import FriendRequestItem from './FriendRequestItem';
import { RootState } from '../../redux/types';
import { Link } from "react-router-dom";
import { User } from 'react-feather';
import FriendsLayout from './FriendsLayout';

interface FriendRequest {
  _id: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  recipient: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
}

interface Friend {
  _id: string
  name: string
  email: string
  avatarUrl?: string
}

export const FriendRequestList: React.FC = () => {
  const userId = useSelector((state: RootState) => state.auth.user?._id)
  const {
    data: requests = [],
    error,
    isLoading,
  } = useGetMyFriendRequestsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })
  const { data: friends = [] } = useGetFriendsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  console.log("Current user ID:", userId)
  console.log("Received requests:", requests)
  console.log("Friends:", friends)

  if (!userId) {
    return <div className="p-4 text-center text-gray-300">User not connected.</div>;
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <div className="animate-pulse flex flex-col items-center max-w-md mx-auto w-full">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
          </div>
          <p className="mt-4 text-gray-400 font-medium">Loading your connections...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="bg-red-900 bg-opacity-20 p-6 rounded-lg border border-red-800 max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-300 mb-2">Connection Error</h3>
            <p className="text-red-400">Failed to load your friend data. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {/* Friend Requests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              Friend Requests
              {requests.length > 0 && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-200">
                  {requests.length}
                </span>
              )}
            </h2>
            <Link
              to="/send-friend-request"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              Add Friend
            </Link>
          </div>

          <div className="bg-gray-800 rounded-md shadow border border-gray-700 overflow-hidden">
            {requests.length === 0 ? (
              <div className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-300 mb-1">No pending requests</h3>
                <p className="text-gray-400">When someone sends you a friend request, it will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700">
                {requests.map((request: FriendRequest) => <FriendRequestItem key={request._id} request={request} />)}
              </div>
            )}
          </div>
        </div>

        {/* Friends Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">
              My Friends
              {friends.length > 0 && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900 text-green-200">
                  {friends.length}
                </span>
              )}
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search friends..."
                className="px-3 py-1.5 pr-8 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {friends.length === 0 ? (
            <div className="bg-gray-800 rounded-md shadow border border-gray-700 p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-1">No friends yet</h3>
              <p className="text-gray-400 mb-4">Start connecting with others by sending friend requests</p>
              <Link
                to="/send-friend-request"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                Find Friends
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {friends.map((friend: Friend) => (
                <div
                  key={friend._id}
                  className="bg-gray-800 rounded-md shadow border border-gray-700 overflow-hidden transition-colors hover:border-blue-600"
                >
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden ring-2 ring-gray-600">
                          {friend.avatarUrl ? (
                            <img
                              src={`http://localhost:5000${friend.avatarUrl}`}
                              className="w-12 h-12 rounded-full object-cover"
                              alt={friend.name}
                            />
                          ) : (
                            <User size={24} className="text-gray-400" />
                          )}
                        </div>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{friend.name}</p>
                        <p className="text-sm text-gray-400">{friend.email}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/private-chat/${friend._id}`}
                        className="flex-1 flex items-center justify-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                        </svg>
                        Chat
                      </Link>
                      <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <FriendsLayout title="Friends">
      {renderContent()}
    </FriendsLayout>
  )
}

export default FriendRequestList
