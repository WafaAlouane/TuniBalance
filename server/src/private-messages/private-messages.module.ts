import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrivateMessagesController } from './private-messages.controller';
import { PrivateMessagesService } from './private-messages.service';
import { PrivateMessage, PrivateMessageSchema } from './private-message.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FriendRequestsModule } from '../friend-request/friend-request.module';
import { UserModule } from '../user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MessagesGateway } from './messages.gateway';


@Module({
  imports: [
    forwardRef(() => FriendRequestsModule),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = file.originalname.split('.').pop();
          cb(null, `${uniqueSuffix}-${file.originalname}`);
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: PrivateMessage.name, schema: PrivateMessageSchema },
     
    ]),
    EventEmitterModule.forRoot(),
   
    UserModule,
    
  ],
  providers: [PrivateMessagesService , MessagesGateway ],
  controllers: [PrivateMessagesController]
})
export class PrivateMessagesModule {}
