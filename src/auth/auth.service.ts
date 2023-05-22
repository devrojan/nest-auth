import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {

  constructor(private readonly mailerService: MailerService) { }


  generateToken(): string {
    // Generate a random number between 0 and 999999 (inclusive)
    let randomNumber = Math.floor(Math.random() * 1000000);

    // Convert the number to a string and pad it with leading zeros if necessary
    let sixDigitNumber = randomNumber.toString().padStart(6, '0');

    return sixDigitNumber;
  }

  sendMailToken(email: string, token: string) {
    this.mailerService.sendMail({
      to: email,
      from: "nest-auth@nest-auth.com",
      subject: "Activation token",
      text: token
    })
  }

}
