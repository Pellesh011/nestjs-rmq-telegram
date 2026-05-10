import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';

import { SendEventDto } from './dto/send-event.dto';

import { TelegramPublisherService } from './telegram.publisher';
import { BaseEvent } from '../types/event.interface';
import { randomUUID } from 'crypto';

@ApiTags('producer')
@Controller('events')
export class ProducerController {
  constructor(private readonly producer: TelegramPublisherService) { }

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBody({ type: SendEventDto })
  async send(@Body() dto: SendEventDto) {
    const event: BaseEvent = {
      id: randomUUID(),
      correlationId: randomUUID(),
      createdAt: new Date().toISOString(),
      type: dto.type,
      payload: dto.payload,
    };
    await this.producer.publish(event);
  }
}