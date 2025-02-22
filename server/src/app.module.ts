import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthResolver } from './auth/auth.resolver';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({global:true,secret:'123'}),
    MongooseModule.forRoot('mongodb://localhost:27017/piweb'),
  AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
