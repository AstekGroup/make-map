import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AirtableModule } from '../airtable/airtable.module';

@Module({
  imports: [AirtableModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
