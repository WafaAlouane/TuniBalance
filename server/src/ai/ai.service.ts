import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AIService {
  constructor(private readonly httpService: HttpService) {}

  async generateJournal(transaction: any): Promise<string> {
    const response = await firstValueFrom(
        this.httpService.post<{ journal_comptable: string }>('http://localhost:5000/generate-journal', transaction)
      );
      
    return response.data.journal_comptable;
  }
}
