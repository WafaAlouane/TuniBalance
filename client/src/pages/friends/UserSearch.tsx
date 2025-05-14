import React, { useState } from 'react';
import { useSearchUsersQuery, useGetAllFriendRequestsQuery, useGetFriendsQuery } from '../../services/friendRequestApi';
import { Search, User } from 'react-feather';

interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface FriendRequest {
  _id: string;
  sender: User;
  recipient: User;
  status: string;
}

interface UserSearchProps {
  onSelectUser: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: users = [], isLoading: isSearching } = useSearchUsersQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  const { data: friendRequests = [] } = useGetAllFriendRequestsQuery();
  const { data: friends = [] } = useGetFriendsQuery();

  const filteredUsers = users.filter((user: User) => {
    const isPendingRequest = friendRequests.some((req: FriendRequest) => {
      return req.status === 'pending' && (
        req.sender._id === user._id || req.recipient._id === user._id
      );
    });

    const isFriend = friends.some((friend: User) => friend._id === user._id);

    return !isPendingRequest && !isFriend;
  });

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors duration-200" />
        </div>
        <input
          type="text"
          placeholder="Search for users..."
          className="w-full pl-10 pr-4 py-3 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow transition-all duration-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {searchTerm.length >= 2 && (
        <div className="absolute w-full mt-2 bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg shadow-xl z-10 max-h-80 overflow-y-auto backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          {isSearching ? (
            <div className="p-6 text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 dark:border-slate-600 border-t-blue-500 mb-3"></div>
              <p>Searching for users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <>
              <div className="p-2 bg-slate-50 dark:bg-slate-700/50 border-b dark:border-slate-600 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4">
                Search Results ({filteredUsers.length})
              </div>
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors border-b dark:border-slate-700 last:border-0"
                  onClick={() => {
                    onSelectUser(user);
                    setSearchTerm('');
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white dark:ring-slate-600 shadow-sm">
                        {user.avatarUrl ? (
                          <img
                            src={`http://localhost:5000${user.avatarUrl}`}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <User size={24} className="text-slate-500 dark:text-slate-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">No users found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
