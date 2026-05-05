import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ProducerService } from './producer.service';
import { SendEventDto } from './dto/send-event.dto';

@ApiTags('producer')
@Controller('events')
export class ProducerController {
  constructor(private readonly producer: ProducerService) {}

  @Post()
  @ApiBody({ type: SendEventDto })
  send(@Body() dto: SendEventDto) {
    return this.producer.publish(dto);
  }
}