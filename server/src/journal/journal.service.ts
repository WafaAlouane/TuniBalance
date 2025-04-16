
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

