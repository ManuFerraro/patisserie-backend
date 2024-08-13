import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { envs } from 'src/config/envs';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "teresabarberenapatisserie@gmail.com",
                pass: "lrjvznczksivhcfq",
            }
        })
    }

    async sendConfirmationEmail(to: string, confirmationToken: string): Promise<void> {
      const confirmationUrl = `http://yourdomain.com/confirm-email?token=${confirmationToken}`;
      try {
        await this.transporter.sendMail({
          from: envs.emailUser,
          to,
          subject: 'Confirm Your Email Address',
          text: `Please confirm your email address by clicking the following link: ${confirmationUrl}`,
          html: `<p>Please confirm your email address by clicking the following link:</p><a href="${confirmationUrl}">${confirmationUrl}</a>`,
        });
      } catch (error) {
        console.error('Error sending confirmation email:', error); 
        throw new InternalServerErrorException('Failed to send confirmation email');
      }
    }
    
      async sendPasswordResetEmail(to: string, resetToken: string): Promise<void> {
        const resetUrl = `http://yourdomain.com/reset-password?token=${resetToken}`;
        await this.transporter.sendMail({
          from: envs.emailUser,
          to,
          subject: 'Password Reset Request',
          text: `You requested a password reset. Please click the following link to reset your password: ${resetUrl}`,
          html: `<p>You requested a password reset. Please click the following link to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`,
        });
      }
}
