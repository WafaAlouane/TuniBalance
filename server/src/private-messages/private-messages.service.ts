import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PrivateMessage } from './private-message.schema';
import { CreatePrivateMessageDto, CreateVoiceMessageDto, EditPrivateMessageDto } from './private-message.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FriendRequestService } from '../friend-request/friend-request.service';
import { Types } from 'mongoose';


@Injectable()
export class PrivateMessagesService {
  constructor(
    @InjectModel(PrivateMessage.name) private privateMessageModel: Model<PrivateMessage>,
   
    // private privateMessageModel: Model<PrivateMessage>,
    private eventEmitter: EventEmitter2,
    private readonly friendRequestService: FriendRequestService,
  ) {}

  async createMessage(senderId: string, createMessageDto: CreatePrivateMessageDto) {
    let replyToData: { content: string; sender: Types.ObjectId } | undefined;
  
    if (createMessageDto.replyTo) {
      const replyToMessage = await this.privateMessageModel.findById(createMessageDto.replyTo)
        .populate('sender', '_id name')
        .exec();
          
      if (!replyToMessage) {
        throw new NotFoundException('Reply message not found');
      }
  
      replyToData = {
        content: replyToMessage.content,
        sender: replyToMessage.sender
      };
    }
  
    const newMessage = new this.privateMessageModel({
      content: createMessageDto.content,
      sender: senderId, // doit être une string ou ObjectId
      recipient: createMessageDto.recipientId,
      replyTo: createMessageDto.replyTo,
    });
    
  
    const savedMessage = await newMessage.save();
    
    const populatedMessage = await this.privateMessageModel
      .findById(savedMessage._id)
      .populate('sender', '_id name')
      .populate('recipient', '_id name')
      .populate('replyTo.sender', '_id name')
      .exec();
  
    if (!populatedMessage) {
      throw new NotFoundException('Message not found after creation');
    }
  
    this.eventEmitter.emit('private-message:new', {
      ...populatedMessage.toObject(),
      sender: populatedMessage.sender,
      recipient: populatedMessage.recipient
    });
  
    return populatedMessage;
  }
  async addReaction(userId: string, messageId: string, type: string) {
    const message = await this.privateMessageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
  
    // Check if user already reacted
    const existingReaction = (message.reactions || []).find(
      reaction => reaction.user.toString() === userId
    );
  
    if (existingReaction) {
      // Update existing reaction
      existingReaction.type = type;
    } else {
      // Add new reaction
      (message.reactions || []).push({ user: new Types.ObjectId(userId), type });
    }
  
    const updatedMessage = await message.save();
    return updatedMessage;
  }
  
  async removeReaction(userId: string, messageId: string) {
    const message = await this.privateMessageModel.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
  
    message.reactions = (message.reactions || []).filter(
      reaction => reaction.user.toString() !== userId
    );
  
    const updatedMessage = await message.save();
    return updatedMessage;
  }



  async markMessagesAsRead(userId: string, otherUserId: string) {
    await this.privateMessageModel.updateMany(
      {
        sender: otherUserId,
        recipient: userId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );
  }

  // private-messages.service.ts

  // private-messages.service.ts
async getMessagesBetweenUsers(userId: string, otherUserId: string) {
  console.log('User IDs:', userId, otherUserId);

  // Vérifier que les IDs sont valides
  if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(otherUserId)) {
    throw new BadRequestException('IDs utilisateur invalides');
  }

  const messages = await this.privateMessageModel
    .find({
      $or: [
        { 
          sender: new Types.ObjectId(userId), 
          recipient: new Types.ObjectId(otherUserId) 
        },
        { 
          sender: new Types.ObjectId(otherUserId), 
          recipient: new Types.ObjectId(userId) 
        }
      ],
      isDeleted: { $ne: true }
    })
    .populate({
      path: 'sender',
      select: '_id name avatarUrl',
      model: 'User' // Assurez-vous que c'est le nom exact du modèle
    })
    .populate({
      path: 'recipient',
      select: '_id name avatarUrl',
      model: 'User'
    })
    .lean();

  console.log('Messages trouvés:', JSON.stringify(messages, null, 2));
  
  return messages;
}
 // In private-messages.service.ts
 async createVoiceMessage(senderId: string, createVoiceMessageDto: CreateVoiceMessageDto) {
  const newVoiceMessage = new this.privateMessageModel({
    sender: senderId,
    recipient: createVoiceMessageDto.recipientId,
    audioUrl: createVoiceMessageDto.audioUrl,
    duration: createVoiceMessageDto.duration,
    isVoiceMessage: true,
    content: 'Voice Message',
    createdAt: new Date()
  });

  const savedMessage = await newVoiceMessage.save();
  
  const populatedMessage = await this.privateMessageModel
    .findById(savedMessage._id)
    .populate('sender', '_id name')
    .populate('recipient', '_id name')
    .exec();

  // Ajoutez la vérification ici aussi
  if (!populatedMessage) {
    throw new NotFoundException('Voice message not found after creation');
  }

  this.eventEmitter.emit('private-message:new', populatedMessage);
  return populatedMessage;
}

async uploadVoiceMessage(file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }

  // Generate a URL for the uploaded file
  const audioUrl = `/uploads/${file.filename}`;

  return { 
    audioUrl,
    filename: file.filename,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  };
}
  async deleteMessage(userId: string, messageId: string) {
    const message = await this.privateMessageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');
    if (message.sender.toString() !== userId) {
      throw new UnauthorizedException('Cannot delete other users messages');
    }
    
    await message.updateOne({ isDeleted: true });
    this.eventEmitter.emit('private-message:deleted', messageId); 
    return { messageId };
  }

  async editMessage(userId: string, messageId: string, editMessageDto: EditPrivateMessageDto) {
    const message = await this.privateMessageModel.findById(messageId);
    if (!message) throw new NotFoundException('Message not found');
    if (message.sender.toString() !== userId) {
      throw new UnauthorizedException('Cannot edit other users messages');
    }

    const updatedMessage = await message.updateOne({
      content: editMessageDto.content,
    });
    
    this.eventEmitter.emit('private-message:updated', {
      messageId,
      content: editMessageDto.content,
      updatedAt: new Date()
    });
    
    return updatedMessage;
  }

 
  
  
}