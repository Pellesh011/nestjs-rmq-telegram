// send-event.dto.ts
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class SendEventDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsOptional()
  payload?: string;
}
