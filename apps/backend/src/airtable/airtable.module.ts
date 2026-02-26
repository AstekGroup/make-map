import { Module } from '@nestjs/common';
import { AirtableService } from './airtable.service';
import { GeocodingModule } from '../geocoding/geocoding.module';

@Module({
  imports: [GeocodingModule],
  providers: [AirtableService],
  exports: [AirtableService],
})
export class AirtableModule {}
