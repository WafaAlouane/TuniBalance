import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { UserRole } from 'src/auth/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const adminExists = await this.userModel.findOne({ role: UserRole.ADMIN });
    if (!adminExists) {
      const admin = new this.userModel({
        name: 'Admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('AdminPassword123!', 10),
        role: UserRole.ADMIN,
        phoneNumber: '0000000000'
      });
      await admin.save();
    }
  }

  async create(userData: {
    name: string;
    password: string;
    role: UserRole;
    email: string;
    phoneNumber: string;
    createdBy?: string;
  }): Promise<UserDocument> {
    const newUser = new this.userModel(userData);
    return newUser.save();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async delete(id: string): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return deletedUser;
  }
  async findById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }
  
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec(); // Ne plus lancer d'exception
  }
}