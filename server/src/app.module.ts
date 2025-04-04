import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import config from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SmsController } from './sms/sms.controller';
import { SmsService } from './sms/sms.service';
import { ProfileModule } from './profile/profile.module';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
<<<<<<< HEAD
=======
import { TwoFactorService } from './services/twofactor.service';
import { TransactionsModule } from './transactions/transactions.module';
import { BilanModule } from './bilan/bilan.module';
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        secret: config.get('jwt.secret'),
      }),
      inject: [ConfigService],
      global: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config) => ({
        uri: config.get('database.connectionString'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,  // Ajoutez AuthModule ici, pas AuthService
<<<<<<< HEAD
    UserModule, ProfileModule, BilanModule,
  ],
  controllers: [AppController, SmsController],
  providers: [AppService, SmsService],
=======
    UserModule, ProfileModule, TransactionsModule,
  ],
  controllers: [AppController, SmsController],
  providers: [AppService, SmsService,TwoFactorService],
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
})
export class AppModule {}
