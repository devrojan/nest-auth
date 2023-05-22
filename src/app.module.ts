import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    AuthModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD
        }
      },
      defaults: {
        from: '"nest-auth" <test@nestauth.com>'
      },
      template: {
        dir: process.cwd() + 'src/mail-templates',
        adapter: new HandlebarsAdapter(),
        options: { strict: true }

      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
