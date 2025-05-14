import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module'; // Importez AuthModule ici

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule), // Ajoutez AuthModule ici
  ],
  controllers: [UsersController],
  // Ajoute AuthModule ici
  providers: [UsersService],
  exports: [UsersService],
})
export class UserModule {}
