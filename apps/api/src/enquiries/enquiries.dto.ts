import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateEnquiryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  fullName!: string;

  @IsString()
  @MinLength(7)
  @MaxLength(25)
  phone!: string;

  @IsEmail()
  @MaxLength(180)
  email!: string;

  @IsInt()
  @Min(1)
  @Max(100)
  members!: number;

  @IsOptional()
  @IsString()
  packageId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  packageName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  packageSlug?: string;

  @IsDateString()
  preferredDate!: string;

  @IsInt()
  @Min(1)
  @Max(365)
  days!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instructions?: string;

  @IsBoolean()
  consent!: boolean;

  @IsOptional()
  @IsString()
  sourcePlatform?: string;

  @IsOptional()
  @IsString()
  website?: string;
}
