import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../user/schemas/user.schema';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';
import { JwtStrategy } from '../auth/Strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { forwardRef } from '@nestjs/common';
import { UserModule } from '../user/user.module'; // Ajoutez UserModule ici pour les dépendances circulaires
import {SmsService} from '../sms/sms.service';
<<<<<<< HEAD
=======
import { TwoFactorService } from 'src/services/twofactor.service';

>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
import { MailService } from 'src/services/mail.service';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: ResetToken.name, schema: ResetTokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => UserModule), 
  // Résolvez la dépendance circulaire ici
  ],
<<<<<<< HEAD
  providers: [AuthService, JwtStrategy, SmsService,MailService], // Ajoutez SmsService ici
=======
  providers: [AuthService, JwtStrategy, SmsService,MailService,TwoFactorService], // Ajoutez SmsService ici
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  controllers: [AuthController],
  
  exports: [AuthService,SmsService,MailService],
})
export class AuthModule {}
