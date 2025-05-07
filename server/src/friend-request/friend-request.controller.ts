import { isValidObjectId } from 'mongoose';

import {
    Body,
    Controller,
    Delete,
    Get,
    Request,
    Param,
    Patch,
    Post,
    UseGuards,
    Query,
    BadRequestException,
  } from '@nestjs/common';
  import { FriendRequestService } from './friend-request.service';
  import { CreateFriendDto } from './CreateFriend.dto';
  import { AuthGuard } from 'src/guards/auth.guard';
@Controller('friend-requests')
@UseGuards(AuthGuard)
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Get()
async getFriends(@Request() req) {
   return this.friendRequestService.getFriends(req.user._id)
}
@Post()

async createFriendRequest(
  @Request() req,
  @Body() { email }: CreateFriendDto,
) {
  return this.friendRequestService.create(req.user._id, email);
}


@Get('sent')
async getSentFriendRequests(@Request() req) {
  return this.friendRequestService.getSentFriendRequests(req.user._id);
}

// friend-request.controller.ts
@Get('me')
async getMyFriendRequests(@Request() req) {
  console.log('User ID from token:', req.user._id);
  const requests = await this.friendRequestService.getMyFriendRequests(req.user._id);
  console.log('Found requests:', requests);
  return requests;
}

  @Patch(':id/accept')
  async acceptFriendRequest(
    @Request() req,
    @Param('id') requestId: string,
  ) {
    // Access user ID from token
    return this.friendRequestService.accept(requestId, req.user._id.toString());
  }
  
  @Get('search')
  async searchUsers(@Request() req, @Query('name') name: string) {
    return this.friendRequestService.searchUsersByName(name, req.user._id);
  }

  @Patch(':id/reject')
  async rejectFriendRequest(
    @Request() req,
    @Param('id') requestId: string,
  ) {
    // Access user ID from token
    return this.friendRequestService.reject(requestId, req.user._id.toString());
  }

  @Delete(':id')
  async cancelFriendRequest(
    @Request() req,
    @Param('id') requestId: string,
  ) {
    // Access user ID from token
    return this.friendRequestService.cancel(requestId, req.user._id.toString());
  }
  /*
@Get('status/:recipientId')
async checkFriendRequestStatus(
  @Request() req,
  @Param('recipientId') recipientId: string
) {
  const senderId = req.user._id; 
  return this.friendRequestService.checkRequestStatus(senderId, recipientId);
}*/
@Get(':id')
async getFriendRequestById(@Param('id') id: string) {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('Invalid ID format');
  }
  return this.friendRequestService.getById(id);
}

  

}