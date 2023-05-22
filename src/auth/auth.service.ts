import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly mailerService: MailerService) {}

  generateToken(): string {
    // Generate a random number between 0 and 999999 (inclusive)
    const randomNumber = Math.floor(Math.random() * 1000000);

    // Convert the number to a string and pad it with leading zeros if necessary
    const sixDigitNumber = randomNumber.toString().padStart(6, '0');

    return sixDigitNumber;
  }

  async hashPassword(password: string) {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  sendMailToken(email: string, token: string) {
    this.mailerService.sendMail({
      to: email,
      from: 'no-reply@nest-auth.com',
      subject: 'Activation token',
      text: token,
      html: `<b>${token}</b>`,
    });

    // this.mailerService
    //   .sendMail({
    //     to: 'test@nestjs.com', // list of receivers
    //     from: 'noreply@nestjs.com', // sender address
    //     subject: 'Testing Nest MailerModule ✔', // Subject line
    //     text: 'welcome', // plaintext body
    //     html: '<b>welcome</b>', // HTML body content
    //   })
    //   .then(() => {})
    //   .catch(() => {});
  }
}
