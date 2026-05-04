import { Module } from '@nestjs/common';
import { BrokerService } from './broker.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  providers: [BrokerService],
})
export class BrokerModule {}