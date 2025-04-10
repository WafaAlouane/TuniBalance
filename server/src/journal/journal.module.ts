import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { PythonService } from '../ai/python.service';  // Import PythonService

@Module({
  controllers: [JournalController],
  providers: [PythonService],  // Add PythonService here as a provider
})
export class JournalModule {}
