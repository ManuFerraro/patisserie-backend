import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmailService } from './email/email.service';
import { AddressModule } from './address/address.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, AddressModule, PrismaModule,

    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [EmailService],
})
export class AppModule {}
