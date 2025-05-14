// immobilisation.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Immobilisation } from './Schema/immobilisation.schema';

@Injectable()
export class ImmobilisationService {
  constructor(
    @InjectModel(Immobilisation.name) private readonly immobilisationModel: Model<Immobilisation>
  ) {}

  async create(data: {
    nom: string;
    valeur_acquisition: number;
  }): Promise<Immobilisation> {
    const created = new this.immobilisationModel(data);
    return created.save();
  }
  
  
  

  // Find all immobilisations
  async findAll(): Promise<Immobilisation[]> {
    return this.immobilisationModel.find().exec();
  }

  // Find a specific immobilisation by ID
  async findOne(id: string): Promise<Immobilisation> {
    const immobilisation = await this.immobilisationModel.findById(id).exec();
    if (!immobilisation) {
      throw new NotFoundException(`Immobilisation with ID ${id} not found`);
    }
    return immobilisation;
  }
}
