// import { Injectable } from '@nestjs/common';
// import { exec } from 'child_process';
// import { promisify } from 'util';

// const execPromise = promisify(exec);

// @Injectable()
// export class JournalService {
//   async generateJournal(): Promise<string> {
//     try {
//       const result = await execPromise('python3 src/journal/generate_journal.py');
//       return result.stdout;
//     } catch (error) {
//       console.error('Erreur lors de l\'exécution du script Python', error);
//       throw new Error('Impossible de générer le journal comptable');
//     }
//   }
// }
import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

@Injectable()
export class JournalService {
  async generateJournal(): Promise<string> {
    try {
      const { stdout } = await execPromise('python ai/generate_journal.py');
      return stdout;
    } catch (error) {
      console.error(error);
      throw new Error('Erreur lors de l\'exécution du script Python');
    }
  }
}

