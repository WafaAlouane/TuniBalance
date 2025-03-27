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
import { TwoFactorService } from './services/twofactor.service';
import { TransactionModule } from './transactions/transactions.module';
import { FactureModule } from './facture/facture.module';

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
    UserModule, ProfileModule, TransactionModule, FactureModule,
  ],
  controllers: [AppController, SmsController],
  providers: [AppService, SmsService,TwoFactorService],
})
export class AppModule {}
