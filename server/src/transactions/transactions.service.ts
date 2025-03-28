import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument } from './schema/transaction.schema';
import { Facture, FactureDocument } from '../facture/Schema/facture.schema'; // Importer le modèle de Facture
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectModel(Facture.name) private factureModel: Model<FactureDocument>  // Injecter le modèle de Facture
  ) {}

  async create(createTransactionDto: CreateTransactionDto, userId: string): Promise<Transaction> {
    // Calcul du montant final avec TVA
    let montantFinal = createTransactionDto.montant;
    if (createTransactionDto.taux_tva) {
      const tvaAmount = (montantFinal * createTransactionDto.taux_tva) / 100;
      montantFinal += tvaAmount;
    }

    // Si un facture_id est fourni, assure-toi que la facture existe
    if (createTransactionDto.facture_id) {
      const facture = await this.factureModel.findById(createTransactionDto.facture_id).exec();
      if (!facture) {
        throw new Error('Facture non trouvée');
      }
    }

    const newTransaction = new this.transactionModel({
      ...createTransactionDto,
      montant: montantFinal,  // Met à jour le montant avec le montant final
      cree_par_user_id: userId,  // Enregistre l'ID de l'utilisateur qui a créé la transaction
    });

    return newTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    const transactions = await this.transactionModel.find().populate('compte_debite_id compte_credite_id cree_par_user_id').exec();
    console.log(transactions);  // Ajout d'un log pour vérifier les données
    return transactions;
  }
  

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).populate('compte_debite_id compte_credite_id cree_par_user_id').exec();
    if (!transaction) throw new NotFoundException('Transaction non trouvée');
    return transaction;
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const updatedTransaction = await this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, { new: true });
    if (!updatedTransaction) throw new NotFoundException('Transaction non trouvée');
    return updatedTransaction;
  }

  async remove(id: string): Promise<void> {
    const deletedTransaction = await this.transactionModel.findByIdAndDelete(id);
    if (!deletedTransaction) throw new NotFoundException('Transaction non trouvée');
  }
}
