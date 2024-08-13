import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { EmailService } from 'src/email/email.service';
import { generateToken } from 'src/utils';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  private readonly logger = new Logger('AuthService');


  private readonly saltRounds = 10;

  async create(createAuthDto: CreateAuthDto) {
    const { email, password, firstName, lastName, role } = createAuthDto;
    const confirmationToken = generateToken();

    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { email: email },
      });

      if (existingUser) {
        throw new BadRequestException('User already exists');
      }

      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      const newUser = await this.prismaService.user.create({
        data: {
          email: email,
          password: hashedPassword,
          firstName: firstName,
          lastName: lastName,
          confirmationToken,
          role: role || Role.USER,
        },
      });

      try {
        await this.emailService.sendConfirmationEmail(email, confirmationToken);
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        await this.prismaService.user.delete({ where: { id: newUser.id } });
        throw new InternalServerErrorException('Failed to send confirmation email');
      }

      return newUser;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async login(loginAutDto: LoginAuthDto) {
    try {
      const user = await this.validateUser(loginAutDto);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { id: user.id };
      const accessToken = this.jwtService.sign(payload);
  
      return { accessToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error; 
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async confirmEmail(token: string): Promise<void> {

    const user = await this.prismaService.user.findFirst({
      where: { confirmationToken: token },
    });

    if (!user) {
      throw new InternalServerErrorException('Invalid confirmation token');
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        isEmailConfirmed: true,
        confirmationToken: null,
      },
    });
  }

  async requestPasswordReset(requestPasswordResetDto: RequestPasswordResetDto): Promise<void> {
    const { email } = requestPasswordResetDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const resetToken = generateToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
  
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiresAt: expiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(email, resetToken);
  }

  async resetPassword(token: string, updatedPasswordDto: UpdatePasswordDto): Promise<void> {
    const { newPassword } = updatedPasswordDto;

    try {
      const user = await this.prismaService.user.findFirst({
        where: { passwordResetToken: token },
      });
  
      if (!user || user.passwordResetTokenExpiresAt < new Date()) {
        throw new InternalServerErrorException('Invalid or expired password reset token');
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, this.saltRounds);
  
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null, 
          passwordResetTokenExpiresAt: null,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while resetting the password');
    }
  }
  
  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  async update(id: number, updateAuthDto: UpdateAuthDto) {
    try {
      const user = await this.prismaService.user.findUnique({ where: { id } });
  
      if (!user) {
        throw new InternalServerErrorException('User not found');
      }
  
      const dataToUpdate: any = {};
  
      if (updateAuthDto.firstName) {
        dataToUpdate.firstName = updateAuthDto.firstName;
      }
      if (updateAuthDto.lastName) {
        dataToUpdate.lastName = updateAuthDto.lastName;
      }
      if (updateAuthDto.email) {
        dataToUpdate.email = updateAuthDto.email;
      }
      if (updateAuthDto.password) {
        const hashedPassword = await bcrypt.hash(updateAuthDto.password, this.saltRounds);
        dataToUpdate.password = hashedPassword;
      }
      if (updateAuthDto.role) {
        dataToUpdate.role = updateAuthDto.role;
      }
  
      await this.prismaService.user.update({
        where: { id: user.id },
        data: dataToUpdate,
      });
  
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async remove(id: number): Promise<void> {
    try {
     
      await this.prismaService.user.delete({
        where: { id }
      });

    } catch (error) {
      if (error.code === 'P2025') { 
        throw new BadRequestException(`El usuario con el id: ${id} no existe`);
      }
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }

  async checkAuthStatus(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId},
    })

    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      ...user,
      token: accessToken
    }
  }

  async validateUser(loginAuthDto: LoginAuthDto): Promise<User | null> {
    const { email, password } = loginAuthDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }
}
