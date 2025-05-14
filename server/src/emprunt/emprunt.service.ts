import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Emprunt } from './Schema/emprunt.schema';
import { Paiement } from 'src/paiement/Schema/paiement.schema';

@Injectable()
export class EmpruntService {
  constructor(
    @InjectModel(Emprunt.name) private empruntModel: Model<Emprunt>,
    @InjectModel(Paiement.name) private paiementModel: Model<Paiement>,
  ) {}

  async create(data: Partial<Emprunt>) {
    return await this.empruntModel.create(data);
  }

  async findAll() {
    return await this.empruntModel.find();
  }

  async calculerAnnuitesConstantes(empruntId: string) {
    const emprunt = await this.empruntModel.findById(empruntId);
    if (!emprunt) throw new NotFoundException('Emprunt non trouvé');

    const taux = emprunt.taux_interet / 100;
    const capital = emprunt.montant;
    const n = emprunt.duree;
    const annuite = capital * (taux / (1 - Math.pow(1 + taux, -n)));

    let capitalRestant = capital;
    for (let i = 1; i <= n; i++) {
      const interet = capitalRestant * taux;
      const amort = annuite - interet;
      capitalRestant -= amort;

      await this.paiementModel.create({
        emprunt_id: emprunt._id,
        date_paiement: new Date(),
        montant_total: annuite,
        montant_interet: interet,
        montant_amortissement: amort,
        capital_restant_du: capitalRestant,
        mode_paiement: 'virement',
        justificatif: 'fichier.pdf',
      });
    }
    return { message: 'Annuités constantes générées' };
  }
}
