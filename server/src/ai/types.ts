export interface Transaction {
    transaction_id: string;
    montant: number;
    date_transaction: string;
    mode_paiement: string;
    statut: string;
    description: string;
    compte: 'Débit' | 'Crédit';
    type_CResultat: 'Exploitation' | 'Financière' | 'Exceptionnelle';
  }
  
  export interface JournalEntry {
    compte: string;
    debit: number;
    credit: number;
  }
  
  export interface DatasetEntry {
    transaction: Transaction;
    journal_comptable: JournalEntry[];
  }
  