import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  ArrayMinSize,
  MinLength,
} from 'class-validator';

export class JobItemDto {
  @IsString({ message: 'The description must be a string.' })
  @IsNotEmpty({ message: 'The description cannot be empty.' })
  @MinLength(3, {
    message: 'The description must be at least 3 characters long.',
  })
  description: string;

  @IsNumber({}, { message: 'The amount must be a number.' })
  @IsPositive({ message: 'The amount must be a positive number.' })
  amount: number;
}

export class CreateJobPayloadDto {
  @IsString({ message: 'The customer name must be a string.' })
  @IsNotEmpty({ message: 'The customer name cannot be empty.' })
  customerName: string;

  @IsEmail({}, { message: 'The provided email is not valid.' })
  @IsNotEmpty({ message: 'The email cannot be empty.' })
  customerEmail: string;

  @IsArray({ message: 'Items must be an array.' })
  @ValidateNested({ each: true })
  @ArrayMinSize(1, { message: 'The job must contain at least one item.' })
  @Type(() => JobItemDto)
  items: JobItemDto[];
}
