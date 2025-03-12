
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

  @Prop({ 
    required: true, 
    enum: UserRole, 
    default: UserRole.BUSINESS_OWNER 
  })
  role: UserRole;

  @Prop({ required: true, 
    match: /^\+216[0-9]{8}$/ 
})
  phoneNumber: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: string; // Pour tracer le créateur

  @Prop({ type: [String], enum: Permission, default: [] })
  permissions: Permission[];
  
  @Prop({ default: false })  
  isEmailConfirmed: boolean;

  @Prop({ type: String, default: null }) 
  verificationToken?: string | null;


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
    this.password = await bcrypt.hash(this.password, salt); // 
    console.log(' Mot de passe haché avec succès');
    next();
  } catch (error) {
    next(new Error('Erreur de hachage du mot de passe'));
  }
});
  UserSchema.methods.comparePassword = async function (
    enteredPassword: string
  ): Promise<boolean> {
    try {
      const isMatch = await bcrypt.compare(enteredPassword, this.password);
      return isMatch;
    } catch (error) {
      return false;
    }
  };
  
  
  
  