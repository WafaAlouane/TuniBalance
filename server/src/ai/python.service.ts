import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class PythonService {
  private execAsync = promisify(exec);

  async runPythonScript() {
    try {
      // Absolute path to the Python script
      const pythonScriptPath = 'C:/Users/Islem/Desktop/firas/TuniBalance/server/src/ai/generate_journal.py';

      const { stdout, stderr } = await this.execAsync(
        `C:/Users/Islem/AppData/Local/Programs/Python/Python313/python.exe ${pythonScriptPath}`
      );
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
      }

      // Process the output (JSON string) from the Python script
      const result = JSON.parse(stdout);
      console.log('Generated Journal:', result);

      return result;
    } catch (error) {
      console.error('Error running Python script:', error);
      throw new Error('Erreur lors de la génération du journal');
    }
  }
}
