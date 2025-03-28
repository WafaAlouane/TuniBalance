
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../auth/enums/role.enum';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Permission } from '../../auth/enums/permission.enum';

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

<<<<<<< HEAD
  @Prop({ 
    required: true, 
    enum: UserRole, 
    default: UserRole.BUSINESS_OWNER 
  })
  role: UserRole;

  @Prop({ required: true, 
    match: /^[+216]{4}[0-9]{8}$/ })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string; // Pour tracer le créateur
=======
  // Supprimer le setter qui convertit en majuscules
@Prop({
  enum: UserRole,
  default: UserRole.BUSINESS_OWNER
})
role: UserRole;


  @Prop({ 
    match: /^(\+216)?[0-9]{8}$/,
    message: 'Le numéro doit contenir 8 chiffres, optionnellement précédés de +216' 
  })
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy?: string;
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245

  @Prop({ type: [String], enum: Permission, default: [] })
  permissions: Permission[];
  
  @Prop({ default: false })  
  isEmailConfirmed: boolean;

  @Prop({ type: String, default: null }) 
  verificationToken?: string | null;

<<<<<<< HEAD

=======
  @Prop()  
  twoFactorSecret: string;
  
>>>>>>> edbe1ea70015acf12bbd826e6d9117bf1c818245
  async comparePassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }
}


export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;

UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // ✅ Un seul hachage
    console.log('✅ Mot de passe haché avec succès');
    next();
  } catch (error) {
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
  
  
  
  