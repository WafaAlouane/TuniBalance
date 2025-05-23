import { Controller, Post, Body, Get, Param, Delete, Put, UseGuards, Patch, UploadedFile, UseInterceptors, BadRequestException, Req } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { PrivateMessagesService } from './private-messages.service';
import { CreatePrivateMessageDto, CreateVoiceMessageDto, EditPrivateMessageDto } from './private-message.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from '../user/schemas/user.schema';
import { CreateReactionDto } from './create-reaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('private-messages')
@UseGuards(AuthGuard)
export class PrivateMessagesController {
  constructor(private readonly privateMessagesService: PrivateMessagesService) {}

  @Post()
async createMessage(
  @Req() req,
  @Body() createMessageDto: CreatePrivateMessageDto,
) {
  const senderId = req.user.userId; // Assure-toi que la stratégie JWT remplit bien req.user
  return this.privateMessagesService.createMessage(senderId, createMessageDto);
}

  @Post(':messageId/reactions')
async addReaction(
  @CurrentUser() user: any,
  @Param('messageId') messageId: string,
  @Body() createReactionDto: CreateReactionDto
) {
  return await this.privateMessagesService.addReaction(
    user.id,
    messageId,
    createReactionDto.type
  );
}

@Patch('mark-as-read/:otherUserId')
  async markMessagesAsRead(
    @CurrentUser() user: any,
    @Param('otherUserId') otherUserId: string,
  ) {
    await this.privateMessagesService.markMessagesAsRead(user.id, otherUserId);
    return { message: 'Messages marked as read' };
  }
  @Post('voice')
async createVoiceMessage(
  @CurrentUser() user: any,
  @Body() createVoiceMessageDto: CreateVoiceMessageDto,
) {
  return this.privateMessagesService.createVoiceMessage(user.id, createVoiceMessageDto);
}
@Post('upload-voice')
@UseInterceptors(FileInterceptor('audio', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      // Force .mp3 extension instead of getting it from original file
      cb(null, `voice-${uniqueSuffix}.mp3`);
    },
  }),
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
}))
async uploadVoiceMessage(@UploadedFile() file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('No file uploaded');
  }
  return this.privateMessagesService.uploadVoiceMessage(file);
}
 
@Delete(':messageId/reactions')
async removeReaction(
  @CurrentUser() user: any,
  @Param('messageId') messageId: string
) {
  return await this.privateMessagesService.removeReaction(
    user.id,
    messageId
  );
}

 
@Get('with/:recipientId')
async getMessagesWith(
  @CurrentUser() user: any,
  @Param('recipientId') recipientId: string,
) {
  return this.privateMessagesService.getMessagesBetweenUsers(user._id, recipientId); // Utiliser _id au lieu de id
}

  @Delete(':messageId')
  async deleteMessage(
    @CurrentUser() user: any,
    @Param('messageId') messageId: string,
  ) {
    return this.privateMessagesService.deleteMessage(user.id, messageId);
  }
 
  
  @Put(':messageId')
  async editMessage(
    @CurrentUser() user: any,
    @Param('messageId') messageId: string,
    @Body() editMessageDto: EditPrivateMessageDto,
  ) {
    return this.privateMessagesService.editMessage(user.id, messageId, editMessageDto);
  }
 

}