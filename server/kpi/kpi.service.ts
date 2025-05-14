import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BilanService } from 'src/bilan/bilan.service';
import { FactureService } from 'src/facture/facture.service';
import { SousCategorieCharge, TypeTransaction } from 'src/transactions/schema/transaction.schema';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class KpiService {

    constructor(
        private readonly factureService: FactureService,
        private readonly transactionsService: TransactionsService,
        private readonly bilanService: BilanService
      ) {}

      async calculerMargeBruteAvecCA(annee: number): Promise<number> {
        try {
          const chiffreAffaires = await this.factureService.calculerChiffreAffaires(annee);
          if (chiffreAffaires <= 0) {
            throw new Error(`Le chiffre d'affaires pour l'année ${annee} est invalide ou inexistant.`);
          }
      
          const transactions = await this.transactionsService.findByYear(annee); 
          if (!transactions || transactions.length === 0) {
            throw new Error(`Aucune transaction trouvée pour l'année ${annee}.`);
          }
      
          const coutDesVentes = transactions
            .filter(
              (transaction) =>
                transaction.categorie === TypeTransaction.CHARGE &&
                transaction.sous_categorie === SousCategorieCharge.ACHAT_MARCHANDISES
            )
            .reduce((total, transaction) => total + transaction.montant, 0);
      
          const margeBrute = chiffreAffaires - coutDesVentes;
          return Number(margeBrute.toFixed(2));

        } catch (error) {
          console.error(`Erreur lors du calcul de la marge brute pour l'année ${annee} :`, error.message);
          throw new Error(`Impossible de calculer la marge brute pour l'année ${annee}.`);
        }
      }
      
      async calculerMargeNette(annee: number): Promise<number> {
        try {
          const compteResultat = await this.transactionsService.getCompteResultat(); 
          if (!compteResultat || compteResultat.benefice === undefined || compteResultat.benefice === null) {
            throw new Error(`Le résultat net pour l'année ${annee} est invalide ou inexistant.`);
          }
          const resultatNet = compteResultat.benefice;
      
          const chiffreAffaires = await this.factureService.calculerChiffreAffaires(annee);
          if (chiffreAffaires <= 0) {
            throw new Error(`Le chiffre d'affaires pour l'année ${annee} est invalide ou inexistant.`);
          }
      
          const margeNette = (resultatNet / chiffreAffaires) * 100;
          return Number(margeNette.toFixed(2));

        } catch (error) {
          console.error(`Erreur lors du calcul de la marge nette pour l'année ${annee} :`, error.message);
          throw new Error(`Impossible de calculer la marge nette pour l'année ${annee}.`);
        }
      }

      /**
   * Calculer la rentabilité économique
   * @param annee - Année pour laquelle calculer la rentabilité économique
   * @returns Rentabilité économique en pourcentage
   */
  async calculerRentabiliteEconomique(annee: number): Promise<number> {
    try {
      const compteResultat = await this.transactionsService.getCompteResultat(); 
      const resultatOperationnel =
        compteResultat.totalProduitsExploitation - compteResultat.totalChargesExploitation;
        console.log("compteResultat.totalProduitsExploitation",compteResultat.totalProduitsExploitation);
        console.log("compteResultat.totalChargesExploitation",compteResultat.totalChargesExploitation);

        console.log("resultatOperationnel",resultatOperationnel);
      if (resultatOperationnel === undefined || resultatOperationnel === null) {
        throw new Error('Le résultat opérationnel est invalide ou inexistant.');
      }

      const bilan = await this.bilanService.findBilanByYear(annee); 
      if (!bilan || bilan.length === 0) {
        throw new Error(`Aucun bilan trouvé pour l'année ${annee}.`);
      }

      const actifsTotaux = bilan[0].totalActifsCirculants + bilan[0].totalActifsNonCirculants;

      if (actifsTotaux <= 0) {
        throw new Error('Les actifs totaux sont invalides ou inexistants.');
      }

      const rentabiliteEconomique = (resultatOperationnel / actifsTotaux) * 100;
      return Number(rentabiliteEconomique.toFixed(2));

    } catch (error) {
      console.error('Erreur lors du calcul de la rentabilité économique :', error.message);
      throw new Error('Impossible de calculer la rentabilité économique.');
    }
  }

  /**
   * Calculer le taux d'endettement
   * @param annee - Année pour laquelle calculer le taux d'endettement
   * @returns Taux d'endettement en pourcentage
   */
  async calculerTauxEndettement(annee: number): Promise<number> {
    try {
      // Étape 1 : Récupérer le bilan pour l'année donnée
      const bilans = await this.bilanService.findBilanByYear(annee);
      if (!bilans || bilans.length === 0) {
        throw new Error(`Aucun bilan trouvé pour l'année ${annee}.`);
      }

      // Extraire les dettes totales et les fonds propres du bilan
      const bilan = bilans[0];
      const dettesTotales = bilan.totalPassifsDettes + bilan.totalPassifsEmprunts; 
      const fondsPropres = bilan.totalCapitauxPropres; // Fonds propres
console.log("dettesTotales",dettesTotales);
console.log("fondsPropres",fondsPropres);

      if (fondsPropres <= 0) {
        throw new Error('Les fonds propres doivent être supérieurs à zéro pour calculer le taux d’endettement.');
      }

      const tauxEndettement = (dettesTotales / fondsPropres) * 100;
      return Number(tauxEndettement.toFixed(2));

    } catch (error) {
      console.error('Erreur lors du calcul du taux d’endettement :', error.message);
      throw new InternalServerErrorException('Impossible de calculer le taux d’endettement.');
    }
  }
      

  async calculerLiquiditeGenerale(annee: number): Promise<number> {
    try {
      const bilans = await this.bilanService.findBilanByYear(annee);
      if (!bilans || bilans.length === 0) {
        throw new Error(`Aucun bilan trouvé pour l'année ${annee}.`);
      }
  
      const bilan = bilans[0];
      const actifsCourtsTermes = bilan.totalActifsCirculants; 
      const passifsCourtsTermes = bilan.totalPassifsDettes;   
  
      if (passifsCourtsTermes <= 0) {
        throw new Error('Les passifs à court terme doivent être supérieurs à zéro pour calculer la liquidité générale.');
      }
  
      const liquiditeGenerale = actifsCourtsTermes / passifsCourtsTermes;
      return Number(liquiditeGenerale.toFixed(2));

    } catch (error) {
      console.error('Erreur lors du calcul de la liquidité générale :', error.message);
      throw new Error('Impossible de calculer la liquidité générale.');
    }
  }
//Par jours pour encaisser ses paiements clients après facturation.
  async calculerDSO(annee: number): Promise<number> {
    try {
      
      const bilans = await this.bilanService.findBilanByYear(annee);
      if (!bilans || bilans.length === 0) {
        throw new Error(`Aucun bilan trouvé pour l'année ${annee}.`);
      }
  
      const bilan = bilans[0]; 
      const creancesClients = bilan.actifsCirculants
        .filter((item) => item.sous_categorie.startsWith('Facture Client Non Payée'))
        .reduce((total, item) => total + item.montant, 0);
  
      if (creancesClients <= 0) {
        throw new Error('Aucune créance client trouvée.');
      }
  
      const chiffreAffairesAnnuel = await this.factureService.calculerChiffreAffaires(annee);
      if (chiffreAffairesAnnuel <= 0) {
        throw new Error('Le chiffre d’affaires doit être supérieur à zéro pour calculer le DSO.');
      }
  
      const dso = (creancesClients / chiffreAffairesAnnuel) * 365;
      return Number(dso.toFixed(2));

    } catch (error) {
      console.error('Erreur lors du calcul du DSO :', error.message);
      throw new Error('Impossible de calculer le DSO.');
    }
  }


  //Retour sur investissement 
  async calculerROI(annee: number): Promise<number> {
    try {
      const compteResultat = await this.transactionsService.getCompteResultat();
      
      if (!compteResultat || compteResultat.benefice === undefined || compteResultat.benefice === null) {
        throw new Error(`Le bénéfice pour l'année ${annee} est invalide.`);
      }
      
      const benefice = compteResultat.benefice;
  
      const coutInvestissement = await this.transactionsService.getCoutInvestissement(annee);
      console.log("benefice",benefice)

  console.log("coutInvestissement",coutInvestissement)
      if (coutInvestissement <= 0) {
        throw new Error(`Le coût d’investissement pour l'année ${annee} est invalide.`);
      }
  
      const roi = ((benefice - coutInvestissement) / coutInvestissement) * 100;
      return Number(roi.toFixed(2));

    } catch (error) {
      console.error(`Erreur lors du calcul du ROI pour l'année ${annee} :`, error.message);
      throw new Error(`Impossible de calculer le ROI pour l'année ${annee}.`);
    }
  }
  
  async calculerTauxCroissanceCA(annee: number): Promise<number> {
    try {
      const chiffreAffairesActuel = await this.factureService.calculerChiffreAffaires(annee);
  
      const chiffreAffairesPrecedent = await this.factureService.calculerChiffreAffaires(annee - 1);
      console.log("chiffreAffairesActuel",chiffreAffairesActuel);

  console.log("chiffreAffairesPrecedent",chiffreAffairesPrecedent);
      if (chiffreAffairesPrecedent <= 0) {
        throw new Error(`Le chiffre d'affaires de l'année ${annee - 1} est invalide.`);
      }
  
      const tauxCroissance = ((chiffreAffairesActuel - chiffreAffairesPrecedent) / chiffreAffairesPrecedent) * 100;
  
      return Number(tauxCroissance.toFixed(2));

    } catch (error) {
      console.error(`Erreur lors du calcul du taux de croissance du chiffre d'affaires :`, error.message);
      throw new Error(`Impossible de calculer le taux de croissance du chiffre d'affaires.`);
    }
  }
  
  
  async calculerTauxMargeCommerciale(annee: number): Promise<number> {
    const chiffreAffaires = await this.factureService.calculerChiffreAffaires(annee);
    const coutAchats = await this.transactionsService.getCoutAchatsMarchandises(annee);
  
    if (chiffreAffaires <= 0 || coutAchats <= 0) {
      throw new Error("Les valeurs du chiffre d'affaires ou du coût d'achat sont invalides.");
    }
  
    const tauxMargeCommerciale = ((chiffreAffaires - coutAchats) / chiffreAffaires) * 100;
    return Number(tauxMargeCommerciale.toFixed(2));
  }
  
}
