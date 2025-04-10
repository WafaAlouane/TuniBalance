// import { Controller, Post, Body } from '@nestjs/common';

// @Controller('journal')
// export class JournalController {
//   @Post('generer')
//   genererJournal(@Body() transaction: any) {
//     const comptes = {
//       Exploitation: { debit: '606 - Achats', credit: '512 - Banque' },
//       Financière: { debit: '627 - Charges financières', credit: '512 - Banque' },
//       Exceptionnelle: { debit: '671 - Charges exceptionnelles', credit: '512 - Banque' },
//     };

//     const montant = transaction.montant;
//     const type = transaction.type_CResultat;
//     const debitAccount = comptes[type].debit;
//     const creditAccount = comptes[type].credit;

//     const journal_comptable = [
//       { compte: debitAccount, debit: montant, credit: 0 },
//       { compte: creditAccount, debit: 0, credit: montant },
//     ];

//     return {
//       transaction,
//       journal_comptable,
//     };
//   }
// }
import { Controller, Get } from '@nestjs/common';
import { PythonService } from '../ai/python.service';

@Controller('journal')
export class JournalController {
  constructor(private readonly pythonService: PythonService) {}

  @Get('generate')
  async generateJournal() {
    try {
      const result = await this.pythonService.runPythonScript();
      return result;
    } catch (error) {
      throw new Error('Erreur lors de la génération du journal');
    }
  }
}
