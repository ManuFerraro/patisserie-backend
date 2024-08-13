import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  newPassword: string;
}