import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { FriendRequest, FriendRequestSchema } from './friend-request.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { AuthModule } from '../auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrivateMessagesModule } from '../private-messages/private-messages.module';
import { PrivateMessage, PrivateMessageSchema } from '../private-messages/private-message.schema';

@Module({
  imports: [
    forwardRef(() => PrivateMessagesModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FriendRequest.name, schema: FriendRequestSchema },
       { name: PrivateMessage.name, schema: PrivateMessageSchema }
    ]),
    
    EventEmitterModule.forRoot(),
    AuthModule,
  ],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestsModule {}