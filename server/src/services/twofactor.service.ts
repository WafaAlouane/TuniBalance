import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode'
import { UsersService } from 'src/user/user.service';

@Injectable()
export class TwoFactorService {
    constructor(private readonly usersService: UsersService) {}
    
    async generateTwoFactorSecret(userId: string) {
        // Récupérer l'utilisateur à partir de l'ID
        const user = await this.usersService.findById(userId); 
      
        if (!user) {
          throw new Error('Utilisateur non trouvé.');
        }
      
        const secret = speakeasy.generateSecret({ length: 20 });
        const otpauthUrl = speakeasy.otpauthURL({
          secret: secret.base32,
          label: user.email,
          issuer: 'TuniBalance',
        });
      
        user.twoFactorSecret = secret.base32;
      
        // Sauvegarder l'utilisateur avec le secret 2FA
        const updatedUser = await this.usersService.update(user._id as string, { twoFactorSecret: secret.base32 });
        console.log('Utilisateur mis à jour:', updatedUser);
      
        // Générer le QR code
        const qrCodeImage = await qrcode.toDataURL(otpauthUrl);
        return { qrCodeImage, secret: secret.base32 };
      }
      


      async verifyTwoFactorAuth(userId: string, token: string) {
        // Chercher l'utilisateur avec cet ID
        const user = await this.usersService.findById(userId);
        
        if (!user?.twoFactorSecret) {
            throw new Error('Erreur : secret 2FA manquant.');
        }
        
        console.log('Secret 2FA:', user.twoFactorSecret);
        console.log('Token reçu:', token);

        // Vérification du token 2FA
        const isValid = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            token: token,
        });

        if (isValid) {
            return { isValid: true, user };
        } else {
            return { isValid: false };
        }
    }


      

      
}
