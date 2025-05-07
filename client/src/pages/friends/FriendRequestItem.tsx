// FriendRequestItem.tsx

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User } from 'react-feather';
import { RootState } from '../../redux/types';
import { useAcceptFriendRequestMutation, useRejectFriendRequestMutation } from '../../services/friendRequestApi';
import { Link } from 'react-router-dom';

interface FriendRequestProps {
  request: {
    _id: string
    sender: {
      _id: string
      name: string
      email: string
      avatarUrl?: string
    }
    recipient: {
      _id: string
      name: string
      email: string
    }
    status: string
  }
}

const FriendRequestItem: React.FC<FriendRequestProps> = ({ request }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [acceptFriendRequest] = useAcceptFriendRequestMutation()
  const [rejectFriendRequest] = useRejectFriendRequestMutation()
  const [actionDone, setActionDone] = useState(false)
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const currentUserId = currentUser?._id;

  const handleAccept = async () => {
    try {
      setLoading(true)
      console.log("Accepting friend request:", request._id)
      await acceptFriendRequest(request._id).unwrap()
      console.log("Request accepted successfully")
      setActionDone(true)
      // Reload page to see changes
      window.location.reload()
    } catch (err) {
      console.error("Error accepting request:", err)
      setError("Failed to accept request.")
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    try {
      setLoading(true)
      console.log("Rejecting friend request:", request._id)
      await rejectFriendRequest(request._id).unwrap()
      console.log("Request rejected successfully")
      setActionDone(true)
    } catch (err) {
      console.error("Error rejecting request:", err)
      setError("Failed to reject request.")
    } finally {
      setLoading(false)
    }
  }

  if (actionDone) return null // Hide element after action

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 border-b border-gray-700">
      <div className="flex items-center gap-3 mb-3 sm:mb-0">
        <div className="relative">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full overflow-hidden ring-1 ring-gray-600">
            {request.sender.avatarUrl ? (
              <img
                src={`http://localhost:5000${request.sender.avatarUrl}`}
                alt={request.sender.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User size={20} className="text-gray-400" />
            )}
          </div>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-800"></span>
        </div>
        <div>
          <div className="font-semibold text-white">{request.sender.name}</div>
          <div className="text-sm text-gray-400">{request.sender.email}</div>
          <div className="text-xs text-gray-500 mt-1">
            <span className="inline-flex items-center">
              <span className="w-2 h-2 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
              Pending request
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {loading ? (
          <div className="flex items-center justify-center px-3 py-1.5 rounded bg-gray-700">
            <div className="animate-spin w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full"></div>
          </div>
        ) : (
          <>
            <button
              onClick={handleAccept}
              disabled={loading}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              disabled={loading}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject
            </button>

            {request.status === "accepted" && (
              <Link to={`/private-chat/${
                request.sender._id === currentUserId
                  ? request.recipient._id // If sender, take recipient
                  : request.sender._id // If recipient, take sender
              }`}>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors">
                  Chat
                </button>
              </Link>
            )}
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-900 bg-opacity-20 border border-red-800 rounded text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default FriendRequestItem
