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
import { TransactionsModule } from './transactions/transactions.module';
import { FactureModule } from './facture/facture.module';
import { JournalModule } from './journal/journal.module';
import { BilanModule } from './bilan/bilan.module';
import { ImmobilisationModule } from './immobilisation/immobilisation.module';
import { AmortissementModule } from './amortissement/amortissement.module';
import { EmpruntModule } from './emprunt/emprunt.module';
import { PaiementModule } from './paiement/paiement.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WebSocketGateway } from '@nestjs/websockets';

import { FriendRequestsModule } from './friend-request/friend-request.module';
import { PrivateMessagesModule } from './private-messages/private-messages.module';
import { MessagesGateway } from './private-messages/messages.gateway';
import { AppointmentsModule } from './appointments/appointments.module';
import { MonitoringModule } from './monitoring.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: ':'
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
        uri: config.get('database.connectionString'), // MongoDB connection string
      }),
      inject: [ConfigService],
    }),
    MonitoringModule,
    AuthModule,
    UserModule,
    ProfileModule,
    JournalModule,
    FactureModule,
    BilanModule,
    ImmobilisationModule,
    AmortissementModule,
    EmpruntModule,
    PaiementModule,
    FriendRequestsModule,
    PrivateMessagesModule,
    AppointmentsModule
  ],
  controllers: [AppController, SmsController],
  providers: [AppService, SmsService, TwoFactorService,MessagesGateway],
  exports: [ ConfigModule, MongooseModule ],
})
export class AppModule {}
