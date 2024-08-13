import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from '@prisma/client';

export class CreateAuthDto {
    @IsEmail()
    email: string;
  
    @IsString()
    password: string;
  
    @IsString()
    firstName: string;
  
    @IsString()
    lastName: string;
  
    @IsEnum(Role)
    @IsOptional()
    role?: Role = Role.USER; 
}
