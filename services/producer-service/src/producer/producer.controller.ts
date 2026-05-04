import { Body, Controller, Post } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { SendEventDto } from './dto/send-event.dto';

@Controller('events')
export class ProducerController {
  constructor(private readonly producer: ProducerService) {}

  @Post()
  async send(@Body() dto: SendEventDto) {
    return this.producer.publish(dto);
  }
}