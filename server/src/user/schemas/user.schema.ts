





/*port { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';  // Utiliser la version native de bcrypt

export enum UserRole {
  ADMIN = 'admin',
  BUSINESS_OWNER = 'business_owner', 
  MANAGER = 'manager',
  FINANCIER = 'financier'
}

// ✅ Déclare une interface qui inclut comparePassword
export interface UserDocument extends Document {
  username: string;
  password: string;
  role: UserRole;
  email: string;
  phoneNumber: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole , default: UserRole.BUSINESS_OWNER})
  role: UserRole;

  @Prop({ required: true, unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })
  email: string; // Validation basique de l'email avec une expression régulière

  @Prop({ required: true, match: /^[0-9]{10}$/ })
  phoneNumber: string; // Validation basique du numéro de téléphone (10 chiffres)

}

export const UserSchema = SchemaFactory.createForClass(User);

// ✅ Middleware pour hacher le mot de passe avant la sauvegarde
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();  // Si le mot de passe n'a pas été modifié, ne rien faire

  try {
    const salt = await bcrypt.genSalt(10); // Générer un salt
    console.log('🔑 Salt généré:', salt);

    this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
    console.log('✅ Mot de passe haché avant sauvegarde:', this.password);
    next();
  } catch (error) {
    console.error('❌ Erreur lors du hachage du mot de passe:', error);
    next(error);  // Gérer l'erreur
  }
});

// ✅ Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  try {
    console.log('🔍 Comparaison entre:', enteredPassword, 'et', this.password);
    const result = await bcrypt.compare(enteredPassword, this.password);
    console.log('🔍 Résultat de la comparaison:', result);
    return result;
  } catch (error) {
    console.error('❌ Erreur lors de la comparaison des mots de passe:', error);
    throw new Error('Erreur lors de la comparaison du mot de passe');
  }
};
*/
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../auth/enums/role.enum';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ 
    required: true, 
    enum: UserRole, 
    default: UserRole.BUSINESS_OWNER 
  })
  role: UserRole;

  @Prop({ required: true, match: /^[0-9]{10}$/ })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string; // Pour tracer le créateur

  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}


export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;
UserSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password') && !this.isNew) return next();
  
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      console.log('✅ Mot de passe haché avec succès');
      next();
    } catch (error) {
      console.error('❌ Erreur de hachage:', error);
      next(new Error('Erreur de hachage du mot de passe'));
    }
  });
  UserSchema.methods.comparePassword = async function (
    enteredPassword: string
  ): Promise<boolean> {
    try {
      console.log('🔍 Comparaison entre:', enteredPassword, 'et', this.password);
      const isMatch = await bcrypt.compare(enteredPassword, this.password);
      console.log('🔍 Résultat (bcrypt.compare):', isMatch);
      return isMatch;
    } catch (error) {
      console.error('❌ Erreur technique:', error);
      return false;
    }
  };
  
  
  
  