import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { FriendRequest, FriendRequestDocument } from './friend-request.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrivateMessage, PrivateMessageDocument } from '../private-messages/private-message.schema';
@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private friendRequestModel: Model<FriendRequestDocument>,
    @InjectModel(PrivateMessage.name) // Ajouter cette ligne
    private privateMessageModel: Model<PrivateMessageDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private eventEmitter: EventEmitter2,
  ) {}
  async getFriendRequests(userId: string) {
    const requests = await this.friendRequestModel
      .find({
        recipient: userId,
        status: 'pending',
      })
      .populate('sender', 'name email phoneNumber') // phone → phoneNumber
      .exec();
  
    return requests.map((req) => ({
      _id: req._id,
      sender: {
        _id: (req.sender as any)._id,
        name: (req.sender as any).name,
        email: (req.sender as any).email,
        phone: (req.sender as any).phoneNumber, // Accès au champ correct
      },
      status: req.status
    }));
  }
  
  
  async getFriends(userId: string) {
    const requests = await this.friendRequestModel.find({
      $or: [
        { sender: new Types.ObjectId(userId) },
        { recipient: new Types.ObjectId(userId) }
      ],
      status: 'accepted'
    })
    .populate('sender', '_id email username firstName lastName')
    .populate('recipient', '_id email username firstName lastName');
  
    return requests.map(request => {
      const sender = request.sender as any;
      const recipient = request.recipient as any;
      const friend = sender._id.toString() === userId ? recipient : sender;
  
      return {
        _id: friend._id,
        email: friend.email,
        username: friend.username,
        firstName: friend.firstName,
        lastName: friend.lastName,
        friendRequestId: request._id,
        status: request.status,
      };
    });
  }
  
  
  async searchUsersByName(name: string, currentUserId: string) {
    // First, find all pending friend requests involving the current user
    const pendingRequests = await this.friendRequestModel.find({
      $or: [
        { sender: new Types.ObjectId(currentUserId), status: 'pending' },
        { recipient: new Types.ObjectId(currentUserId), status: 'pending' }
      ]
    });
  
    // Get the IDs of users involved in pending requests
    const userIdsWithPendingRequests: Types.ObjectId[] = pendingRequests.reduce((ids: Types.ObjectId[], request) => {
      if (request.sender.toString() !== currentUserId) {
        ids.push(request.sender);
      }
      if (request.recipient.toString() !== currentUserId) {
        ids.push(request.recipient);
      }
      return ids;
    }, []);
  
    // Find users excluding current user and users with pending requests
    const users = await this.userModel.find({
      name: { $regex: name, $options: 'i' },  // Case-insensitive search
      _id: { 
        $ne: new Types.ObjectId(currentUserId),  // Exclude current user
        $nin: userIdsWithPendingRequests  // Exclude users with pending requests
      }
    })
    .select('_id name email phoneNumber')
    .limit(5)
    .exec();
  
    return users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber
    }));
  }





  async getSentFriendRequests(userId: string) {
    const requests = await this.friendRequestModel
      .find({
        sender: userId,
        status: 'pending',
      })
      .populate('recipient', 'name email phoneNumber') // phone → phoneNumber
      .exec();
  
    return requests.map((req) => ({
      _id: req._id,
      recipient: {
        _id: (req.recipient as any)._id,
        name: (req.recipient as any).name,
        email: (req.recipient as any).email,
        phone: (req.recipient as any).phoneNumber, // Accès au champ correct
      },
      status: req.status
    }));
  }
  
  
  async getById(id: string) {
    const request = await this.friendRequestModel.findById(id)
      .populate('sender', 'name email')
      .populate('recipient', 'name email');
    if (!request) throw new NotFoundException('Friend request not found');
    return request;
  }
  // friend-request.service.ts
async getMyFriendRequests(userId: string) {
  return this.friendRequestModel.find({ 
    recipient: new Types.ObjectId(userId), 
    status: 'pending' 
  })
  .populate({
    path: 'sender',
    select: 'name email phoneNumber',
    model: 'User' 
  }) 
  .exec();
}
  
  async create(senderId: string, recipientEmail: string) {
    const recipient = await this.userModel.findOne({ email: recipientEmail }).exec();
    if (!recipient) {
      throw new NotFoundException('User not found');
    }

    if ((recipient._id as Types.ObjectId).toString() === senderId.toString()) {
      throw new BadRequestException('Cannot send friend request to yourself');
    }

    // Check if friend request already exists
    const existingRequest = await this.friendRequestModel.findOne({
      $or: [
        { sender: senderId, recipient: recipient._id, status: 'pending' },
        { sender: recipient._id, recipient: senderId, status: 'pending' },
      ],
    });

    if (existingRequest) {
      throw new BadRequestException('Friend request already exists');
    }

    const friendRequest = new this.friendRequestModel({
      sender: senderId,
      recipient: recipient._id,
    });

    return (await friendRequest.save()).populate('sender recipient', 'name email phoneNumber');
}

// friend-request.service.ts
async accept(requestId: string, userId: string) {
  const request = await this.friendRequestModel.findByIdAndUpdate(
    requestId,
    { status: 'accepted' },
    { new: true }
  ).populate('sender recipient');

  if (!request) {
    throw new NotFoundException('Friend request not found');
  }

  // Créer un message système
  const initialMessage = new this.privateMessageModel({
    content: 'Vous êtes maintenant amis! Commencez à discuter!',
    sender: request.sender._id,
    recipient: request.recipient._id,
    isSystemMessage: true
  });

  await initialMessage.save();

  this.eventEmitter.emit('friend-request:accepted', {
    requestId,
    friend: request.sender._id.equals(userId) ? request.recipient : request.sender
  });

  return request;
}

async reject(requestId: string, userId: string) {
  const updated = await this.friendRequestModel.findByIdAndUpdate(
    requestId,
    { status: 'rejected' },
    { new: true } // ← Ajoutez ceci
  ).populate('sender recipient');
  return updated;
}
  async cancel(requestId: string, userId: string) {
    const friendRequest = await this.friendRequestModel
      .findOne({
        _id: new Types.ObjectId(requestId),
        sender: new Types.ObjectId(userId),
        status: 'pending'
      })
      .exec();
  
    if (!friendRequest) {
      throw new NotFoundException('Pending friend request not found');
    }
  
    await this.friendRequestModel.deleteOne({ _id: new Types.ObjectId(requestId) }).exec();
    return { message: 'Friend request cancelled successfully' };
  }

 /* async areFriends(userId1: string, userId2: string): Promise<boolean> {
    console.log(`Vérification d'amitié entre ${userId1} et ${userId2}`)

    try {
      // Convertir les IDs en ObjectId si ce ne sont pas déjà des ObjectId
      const id1 = typeof userId1 === "string" ? new Types.ObjectId(userId1) : userId1
      const id2 = typeof userId2 === "string" ? new Types.ObjectId(userId2) : userId2

      // Rechercher une demande d'ami acceptée dans n'importe quelle direction
      const request = await this.friendRequestModel.findOne({
        $or: [
          { sender: id1, recipient: id2, status: "accepted" },
          { sender: id2, recipient: id1, status: "accepted" },
        ],
      })

      const result = !!request
      console.log(`Résultat de la vérification d'amitié: ${result}`, request)
      return result
    } catch (error) {
      console.error("Erreur lors de la vérification d'amitié:", error)
      return false
    }
  }*/

  /*
async areFriends(userId1: string, userId2: string): Promise<boolean> {
  console.log('Vérification amitié entre:', userId1, 'et', userId2);
  
  const query = {
    $or: [
      { 
        sender: new Types.ObjectId(userId1), 
        recipient: new Types.ObjectId(userId2),
        status: 'accepted' 
      },
      { 
        sender: new Types.ObjectId(userId2), 
        recipient: new Types.ObjectId(userId1),
        status: 'accepted' 
      }
    ]
  };

  console.log('Requête MongoDB:', JSON.stringify(query));
  
  const count = await this.friendRequestModel.countDocuments(query);
  console.log('Nombre de relations trouvées:', count);

  return count > 0;
}*//*
  // In your service
async checkRequestStatus(senderId: string, recipientId: string) {
  // Check if already friends
  const areFriends = await this.areFriends(senderId, recipientId);
  if (areFriends) {
    return { status: 'friends' };
  }

  // Check for pending requests in either direction
  const request = await this.friendRequestModel.findOne({
    $or: [
      { sender: new Types.ObjectId(senderId), recipient: new Types.ObjectId(recipientId) },
      { sender: new Types.ObjectId(recipientId), recipient: new Types.ObjectId(senderId) }
    ],
    status: 'pending'
  });

  if (!request) {
    return { status: 'none' };
  }

  return {
    status: request.sender.toString() === senderId ? 'request-sent' : 'request-received',
    requestId: request._id
  };
}
  

  
  */
  
}