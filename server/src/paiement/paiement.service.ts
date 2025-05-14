import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paiement, PaiementDocument } from './Schema/paiement.schema';

@Injectable()
export class PaiementService {
  constructor(
    @InjectModel(Paiement.name) private readonly paiementModel: Model<PaiementDocument>,
  ) {}

  async findAll() {
    return this.paiementModel.find().exec();
  }

  async create(paiement: PaiementDocument) {
    const createdPaiement = new this.paiementModel(paiement);
    return createdPaiement.save();
  }

  async findById(id: string) {
    return this.paiementModel.findById(id).exec();
  }

  async remove(id: string) {
    return this.paiementModel.findByIdAndDelete(id).exec();
  }
}
