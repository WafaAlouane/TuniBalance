import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Immobilisation } from 'src/immobilisation/Schema/immobilisation.schema';
import { Emprunt } from 'src/emprunt/Schema/emprunt.schema';
import { Amortissement } from './Schema/amortissement.schema';

@Injectable()
export class AmortissementService {
  constructor(
    @InjectModel(Immobilisation.name) private immobilisationModel: Model<Immobilisation>,
    @InjectModel(Emprunt.name) private empruntModel: Model<Emprunt>,
    @InjectModel(Amortissement.name) private amortissementModel: Model<Amortissement>,
  ) {}

  // ========================= IMMOBILISATION ========================= //

  // Amortissement Linéaire Immobilisation
  async calculerAmortissementLineaireImmobilisation(id: string) {
    const immobilisation = await this.immobilisationModel.findById(id);
    if (!immobilisation) throw new NotFoundException('Immobilisation non trouvée');

    const annuite = immobilisation.valeur_acquisition / immobilisation.duree_amortissement;

    for (let i = 1; i <= immobilisation.duree_amortissement; i++) {
      await this.amortissementModel.create({
        immobilisation_id: immobilisation._id,
        date: new Date(),
        montant_amortissement: annuite,
        cumul_amortissement: annuite * i,
        valeur_nette: immobilisation.valeur_acquisition - annuite * i,
        type: 'lineaire',
        exercice: `Exercice ${i}`,
      });
    }
    return { message: 'Amortissement linéaire pour immobilisation généré' };
  }
// Récupérer tous les amortissements
async getAmortissements() {
  return await this.amortissementModel.find().populate('immobilisation_id').populate('emprunt_id');
}

// Récupérer un amortissement par ID
async getAmortissementById(id: string) {
  const amortissement = await this.amortissementModel.findById(id).populate('immobilisation_id').populate('emprunt_id');
  if (!amortissement) throw new NotFoundException('Amortissement non trouvé');
  return amortissement;
}

// Service : Regrouper les amortissements par ID
async getAmortissementsParId(id: string) {
  const amortissements = await this.amortissementModel
    .find({ $or: [{ immobilisation_id: id }, { emprunt_id: id }] })
    .populate('immobilisation_id')
    .populate('emprunt_id');

  if (!amortissements || amortissements.length === 0) {
    throw new NotFoundException('Aucun amortissement trouvé pour cet ID');
  }

  return amortissements;
}

  // Amortissement Dégressif Immobilisation
  async calculerAmortissementDegressifImmobilisation(id: string) {
    const immobilisation = await this.immobilisationModel.findById(id);
    if (!immobilisation) throw new NotFoundException('Immobilisation non trouvée');

    const taux = (1 / immobilisation.duree_amortissement) * 1.75;
    let base = immobilisation.valeur_acquisition;
    let cumul = 0;

    for (let i = 1; i <= immobilisation.duree_amortissement; i++) {
      const montant = base * taux;
      cumul += montant;
      base -= montant;

      await this.amortissementModel.create({
        immobilisation_id: immobilisation._id,
        date: new Date(),
        montant_amortissement: montant,
        cumul_amortissement: cumul,
        valeur_nette: base,
        type: 'degressif',
        exercice: `Exercice ${i}`,
      });
    }

    return { message: 'Amortissement dégressif pour immobilisation généré' };
  }

  // Amortissement Variable Immobilisation
  async calculerAmortissementVariableImmobilisation(id: string, tauxs: number[]) {
    const immobilisation = await this.immobilisationModel.findById(id);
    if (!immobilisation) throw new NotFoundException('Immobilisation non trouvée');

    if (tauxs.length !== immobilisation.duree_amortissement) {
      throw new Error('Le nombre de taux ne correspond pas à la durée d’amortissement');
    }

    let base = immobilisation.valeur_acquisition;
    let cumul = 0;

    for (let i = 0; i < tauxs.length; i++) {
      const montant = base * (tauxs[i] / 100);
      cumul += montant;
      base -= montant;

      await this.amortissementModel.create({
        immobilisation_id: immobilisation._id,
        date: new Date(),
        montant_amortissement: montant,
        cumul_amortissement: cumul,
        valeur_nette: base,
        type: 'variable',
        exercice: `Exercice ${i + 1}`,
      });
    }

    return { message: 'Amortissement variable pour immobilisation généré' };
  }

  // ========================= EMPRUNT ========================= //

  // Amortissement Linéaire Emprunt
  async calculerAmortissementLineaireEmprunt(id: string) {
    const emprunt = await this.empruntModel.findById(id);
    if (!emprunt) throw new NotFoundException('Emprunt non trouvé');

    const taux = emprunt.taux_interet / 100;
    const mensualite = emprunt.montant * taux / (1 - Math.pow(1 + taux, -emprunt.duree));
    let capitalRestant = emprunt.montant;

    for (let i = 1; i <= emprunt.duree; i++) {
      const interet = capitalRestant * taux;
      const amortissementCapital = mensualite - interet;
      capitalRestant -= amortissementCapital;

      await this.amortissementModel.create({
        emprunt_id: emprunt._id,
        date: new Date(),
        montant_amortissement: amortissementCapital,
        cumul_amortissement: emprunt.montant - capitalRestant,
        valeur_nette: capitalRestant,
        type: 'lineaire',
        exercice: `Mois ${i}`,
      });
    }

    return { message: 'Amortissement linéaire pour emprunt généré' };
  }

  // Amortissement Dégressif Emprunt
  async calculerAmortissementDegressifEmprunt(id: string) {
    const emprunt = await this.empruntModel.findById(id);
    if (!emprunt) throw new NotFoundException('Emprunt non trouvé');

    const taux = emprunt.taux_interet / 100;
    let base = emprunt.montant;
    let cumul = 0;

    for (let i = 1; i <= emprunt.duree; i++) {
      const interet = base * taux;
      const montant = base * (taux / (1 + taux * (emprunt.duree - i + 1)));
      cumul += montant;
      base -= montant;

      await this.amortissementModel.create({
        emprunt_id: emprunt._id,
        date: new Date(),
        montant_amortissement: montant,
        cumul_amortissement: cumul,
        valeur_nette: base,
        type: 'degressif',
        exercice: `Mois ${i}`,
      });
    }

    return { message: 'Amortissement dégressif pour emprunt généré' };
  }
}
