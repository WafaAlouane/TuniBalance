
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
