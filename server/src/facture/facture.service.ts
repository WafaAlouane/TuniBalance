import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Facture, FactureDocument } from './schema/facture.schema';
import { Transaction, TransactionDocument } from '../transactions/schema/transaction.schema';
import * as pdfParse from 'pdf-parse';
import * as fs from 'fs';
@Injectable()
export class FactureService {
  constructor(
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
  ) {}

  async createFacture(factureData: any): Promise<FactureDocument> {
    try {
      const { transactions, type_facture, ...factureDetails } = factureData;

      if (!transactions || transactions.length === 0) {
        throw new BadRequestException('Une facture doit contenir au moins une transaction.');
      }

      console.log("Transactions reçues :", transactions);

      const createdTransactions = await this.transactionModel.insertMany(
        transactions.map((transaction: any) => ({
          ...transaction,
          compte: transaction.compte,
          description: transaction.description,
        })),
      );

      console.log("Transactions créées :", createdTransactions);

      const facture = new this.factureModel({
        ...factureDetails,
        type_facture,
        transactions: createdTransactions,
      });

      return await facture.save();
    } catch (error) {
      console.error("Erreur lors de la création de la facture :", error.message);
      throw new InternalServerErrorException('Erreur lors de la création de la facture.');
    }
  }

  async findAllFactures(): Promise<FactureDocument[]> {
    try {
      return await this.factureModel.find().populate('transactions').exec();
    } catch (error) {
      console.error("Erreur lors de la récupération des factures :", error.message);
      throw new InternalServerErrorException('Erreur lors de la récupération des factures.');
    }
  }

  async findAllFacturesForClient(): Promise<FactureDocument[]> {
    try {
      return await this.factureModel
        .find({ type_facture: 'client' })
        .populate('transactions')
        .exec();
    } catch (error) {
      console.error("Erreur lors de la récupération des factures clients :", error.message);
      throw new InternalServerErrorException('Erreur lors de la récupération des factures clients.');
    }
  }

  async findAllFacturesForFournisseur(): Promise<FactureDocument[]> {
    try {
      return await this.factureModel
        .find({ type_facture: 'fournisseur' })
        .populate('transactions')
        .exec();
    } catch (error) {
      console.error("Erreur lors de la récupération des factures fournisseurs :", error.message);
      throw new InternalServerErrorException('Erreur lors de la récupération des factures fournisseurs.');
    }
  }

  


}
