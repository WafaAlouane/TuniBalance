import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthResolver } from './auth/auth.resolver';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import config  from './config/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    cache:true,
    load:[config],
  }),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      useFactory:async (config)=>({
        secret:config.get('jwt.secret'),
      }),
      global:true,
      inject:[ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:async (config)=>({
        uri:config.get('database.connectionString'),
      }),
      inject :[ConfigService],
    }),AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
