import { writeFileSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// ------------------- Types -------------------
interface Transaction {
  transaction_id: string;
  montant: number;
  date_transaction: string;
  mode_paiement: string;
  statut: string;
  description: string;
  compte: 'Débit' | 'Crédit';
  type_CResultat: 'Exploitation' | 'Financière' | 'Exceptionnelle';
}

interface JournalEntry {
  compte: string;
  debit: number;
  credit: number;
}

interface DatasetEntry {
  transaction: Transaction;
  journal_comptable: JournalEntry[];
}

// ------------------- Données de base -------------------
const comptes = {
  Exploitation: { debit: '606 - Achats', credit: '512 - Banque' },
  Financière: { debit: '627 - Charges financières', credit: '512 - Banque' },
  Exceptionnelle: { debit: '671 - Charges exceptionnelles', credit: '512 - Banque' },
};

const types = ['Exploitation', 'Financière', 'Exceptionnelle'];
const paiements = ['Carte Bancaire', 'Espèces', 'Virement', 'Chèque'];
const statuts = ['Effectuée', 'En attente', 'Rejetée'];

// ------------------- Génération -------------------
const dataset: DatasetEntry[] = [];

for (let i = 0; i < 200; i++) {
  const type = types[Math.floor(Math.random() * types.length)];
  const montant = +(Math.random() * 5000 + 100).toFixed(2);
  const debitAccount = comptes[type].debit;
  const creditAccount = comptes[type].credit;

  const transaction: Transaction = {
    transaction_id: uuidv4(),
    montant,
    date_transaction: new Date().toISOString(),
    mode_paiement: paiements[Math.floor(Math.random() * paiements.length)],
    statut: statuts[Math.floor(Math.random() * statuts.length)],
    description: `Transaction ${type}`,
    compte: Math.random() > 0.5 ? 'Débit' : 'Crédit',
    type_CResultat: type as Transaction['type_CResultat'],
  };

  const journal: JournalEntry[] = [
    { compte: debitAccount, debit: montant, credit: 0 },
    { compte: creditAccount, debit: 0, credit: montant },
  ];

  dataset.push({ transaction, journal_comptable: journal });
}

// ------------------- Sauvegarde -------------------
writeFileSync('dataset.json', JSON.stringify(dataset, null, 2));
console.log('✅ Dataset généré dans dataset.json');
