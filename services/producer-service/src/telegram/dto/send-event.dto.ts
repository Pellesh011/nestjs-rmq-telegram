import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendEventDto {
  @ApiProperty({
    example: 'user.created',
    description: 'Тип события',
  })
  @IsString()
  @IsNotEmpty()
  type!: string;

  @ApiPropertyOptional({
    example: '{"id":1}',
    description: 'Payload события',
  })
  @IsString()
  @IsOptional()
  payload?: string;
}