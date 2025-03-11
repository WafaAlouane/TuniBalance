import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-2fa-totp';
import * as speakeasy from 'speakeasy';

@Injectable()
export class TwoFactorStrategy extends PassportStrategy(Strategy, '2fa-totp') {
  constructor() {
    super({
      codeField: 'token',
      verify: (user, done) => {
        const secret = user.twoFactorSecret;
        const tokenValidates = speakeasy.totp.verify({
          secret,
          encoding: 'base32',
          token: user.token,
        });
        done(null, tokenValidates);
      },
    });
  }
}