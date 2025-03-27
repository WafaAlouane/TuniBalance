import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './Schema/facture.schema';
import { CreateFactureDto } from './dto/create-facture.dto';

@Injectable()
export class FactureService {
  constructor(@InjectModel(Facture.name) private factureModel: Model<FactureDocument>) {}

  async create(createFactureDto: CreateFactureDto): Promise<FactureDocument> {
    const createdFacture = new this.factureModel(createFactureDto);
    return createdFacture.save();
  }

  async findAll(): Promise<Facture[]> {
    return this.factureModel.find().exec();
  }

  async findOne(id: string): Promise<FactureDocument | null> {
    return this.factureModel.findOne({ id }).exec();
  }
}
