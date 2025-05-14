import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User, UserPlus, UserMinus, Search } from 'react-feather';
import { RootState } from '../../redux/types';
import { friendRequestApi } from '../../services/friendRequestApi';
import FriendsLayout from './FriendsLayout';

export const {
  useSearchUsersQuery,
  useCreateFriendRequestMutation,
  useCancelFriendRequestMutation,
  useGetFriendsQuery,
  useGetFriendRequestByIdQuery,
  useGetMyFriendRequestsQuery,
} = friendRequestApi;

const SendFriendRequest = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: suggestions = [], isLoading } = useSearchUsersQuery(searchTerm, {
    skip: searchTerm.length < 1,
  });

  const { data: friendRequests = [] } = useGetMyFriendRequestsQuery();


  const { data: friends = [] } = useGetFriendsQuery();

  const [sendRequest] = useCreateFriendRequestMutation();
  const [cancelRequest] = useCancelFriendRequestMutation();

  const isAlreadyFriend = (userId: string) => {
    return friends?.some(friend => friend._id === userId);
  };

  const getPendingRequest = (userId: string) => {
    return friendRequests.find(
      (request) =>
        ((request.sender._id === currentUser?._id && request.recipient._id === userId) ||
        (request.recipient._id === currentUser?._id && request.sender._id === userId)) &&
        request.status === 'pending'
    );
  };

  const filteredSuggestions = suggestions.filter((user) => {
    if (user._id === currentUser?._id || isAlreadyFriend(user._id)) return false;
    return !getPendingRequest(user._id);
  });

  const [actionStatus, setActionStatus] = useState<{
    loading: boolean;
    success: boolean;
    error: boolean;
    message: string;
    userId?: string;
  }>({
    loading: false,
    success: false,
    error: false,
    message: '',
  });

  const handleFriendAction = async (user: any) => {
    const pendingRequest = getPendingRequest(user._id);
    setActionStatus({
      loading: true,
      success: false,
      error: false,
      message: 'Processing...',
      userId: user._id
    });

    try {
      if (pendingRequest) {
        await cancelRequest(pendingRequest._id).unwrap();
        setActionStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Friend request canceled',
          userId: user._id
        });

        // Reset status after 3 seconds
        setTimeout(() => {
          setActionStatus(prev => ({
            ...prev,
            success: false,
            message: ''
          }));
        }, 3000);
      } else {
        await sendRequest({ email: user.email }).unwrap();
        setActionStatus({
          loading: false,
          success: true,
          error: false,
          message: 'Friend request sent',
          userId: user._id
        });

        // Reset status after 3 seconds
        setTimeout(() => {
          setActionStatus(prev => ({
            ...prev,
            success: false,
            message: ''
          }));
        }, 3000);
      }
    } catch (error) {
      setActionStatus({
        loading: false,
        success: false,
        error: true,
        message: 'Error during the action',
        userId: user._id
      });

      // Reset error after 3 seconds
      setTimeout(() => {
        setActionStatus(prev => ({
          ...prev,
          error: false,
          message: ''
        }));
      }, 3000);
    }
  };

  const renderContent = () => {
    return (
      <div className="relative w-full max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Find Friends</h2>
          {actionStatus.success && (
            <div className="px-3 py-1 bg-green-900 bg-opacity-30 text-green-400 text-sm rounded-full animate-pulse">
              {actionStatus.message}
            </div>
          )}
          {actionStatus.error && (
            <div className="px-3 py-1 bg-red-900 bg-opacity-30 text-red-400 text-sm rounded-full animate-pulse">
              {actionStatus.message}
            </div>
          )}
        </div>

        <div className="relative mb-6 bg-gray-800 rounded-md shadow border border-gray-700">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search for users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border-0 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>

        {isLoading && (
          <div className="p-6 flex flex-col items-center justify-center bg-gray-800 rounded-md shadow border border-gray-700">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-300">Searching for users...</p>
          </div>
        )}

        {!isLoading && searchTerm.length >= 1 && filteredSuggestions.length === 0 && (
          <div className="p-6 text-center bg-gray-800 rounded-md shadow border border-gray-700">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-1">No users found</h3>
            <p className="text-gray-400">Try a different search term</p>
          </div>
        )}

        {searchTerm.length >= 1 && filteredSuggestions.length > 0 && (
          <div className="bg-gray-800 rounded-md shadow border border-gray-700 overflow-hidden">
            <div className="p-2 bg-gray-700 border-b border-gray-600 text-xs font-medium text-gray-300 uppercase tracking-wider px-4">
              Search Results ({filteredSuggestions.length})
            </div>
            <div className="divide-y divide-gray-700">
              {filteredSuggestions.map((user) => {
                const pendingRequest = getPendingRequest(user._id);
                const isFriend = isAlreadyFriend(user._id);
                const isLoading = actionStatus.loading && actionStatus.userId === user._id;

                return (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden ring-1 ring-gray-600">
                          {user.avatarUrl ? (
                            <img
                              src={`http://localhost:5000${user.avatarUrl}`}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User size={20} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">{user.name}</p>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      </div>
                    </div>

                    {isLoading ? (
                      <div className="flex items-center justify-center w-8 h-8">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-blue-500"></div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleFriendAction(user)}
                        disabled={isFriend}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                          isFriend
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : pendingRequest
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {isFriend ? (
                          <>
                            <User size={14} />
                            Friends
                          </>
                        ) : pendingRequest ? (
                          <>
                            <UserMinus size={14} />
                            Cancel
                          </>
                        ) : (
                          <>
                            <UserPlus size={14} />
                            Add Friend
                          </>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <FriendsLayout title="Add Friends">
      {renderContent()}
    </FriendsLayout>
  );
};

export default SendFriendRequest;
