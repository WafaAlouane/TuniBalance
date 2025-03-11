import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './Schemas/profile.schema'; // Import Profile schema
import { UserModule } from '../user/user.module'; // Import UsersModule
@Module({
    imports: [
      MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]), 
      UserModule, 
    ],
    providers: [ProfileService],
    controllers: [ProfileController],
  })
  export class ProfileModule {}