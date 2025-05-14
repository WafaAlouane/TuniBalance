import { Module } from '@nestjs/common';
import { JournalController } from 'src/journal/journal.controller';

@Module({
  controllers: [JournalController],
})
export class JournalModule {}
