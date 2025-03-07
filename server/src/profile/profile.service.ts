import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from './Schemas/profile.schema';
import { UsersService } from '../user/user.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private usersService: UsersService
  ) {}

  async createProfile(userId: string, createProfileDto: CreateProfileDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const existingProfile = await this.profileModel.findOne({ userId });
    if (existingProfile) {
      throw new NotFoundException('Profil existe déjà');
    }

    const newProfile = new this.profileModel({
      userId,
      ...createProfileDto
    });

    await newProfile.save();
    return this.getFullProfile(userId);
  }

  async getFullProfile(userId: string) {
    const [user, profile] = await Promise.all([
      this.usersService.findById(userId),
      this.profileModel.findOne({ userId })
    ]);

    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    return {
      userInfo: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
       
      },
      businessInfo: profile ? profile.toObject() : null
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const updatedProfile = await this.profileModel.findOneAndUpdate(
      { userId },
      updateProfileDto,
      { new: true, upsert: true }
    );

    return this.getFullProfile(userId);
  }
}