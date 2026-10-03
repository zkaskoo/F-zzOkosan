import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly from: string;
  private readonly appUrl: string;

  constructor(private config: ConfigService) {
    this.from =
      this.config.get<string>('MAIL_FROM') ||
      'FőzzOkosan <no-reply@fozzokosan.local>';
    this.appUrl = (
      this.config.get<string>('APP_URL') || 'http://localhost:3000'
    ).replace(/\/$/, '');

    const host = this.config.get<string>('SMTP_HOST');
    if (host) {
      this.transporter = nodemailer.createTransport({
        host,
        port: parseInt(this.config.get<string>('SMTP_PORT') || '587', 10),
        secure: this.config.get<string>('SMTP_SECURE') === 'true', // 465 esetén true
        auth: {
          user: this.config.get<string>('SMTP_USER'),
          pass: this.config.get<string>('SMTP_PASS'),
        },
      });
    } else {
      this.logger.warn(
        'SMTP nincs konfigurálva (SMTP_HOST hiányzik). Az emailek tartalma a logba kerül.',
      );
    }
  }

  isConfigured(): boolean {
    return !!this.transporter;
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const link = `${this.appUrl}/verifikacio?token=${token}`;
    const subject = 'Erősítsd meg az email-címed – FőzzOkosan';
    const html = this.layout(
      `Szia ${this.escape(name)}!`,
      `Köszönjük a regisztrációt a FőzzOkosanon. A fiókod aktiválásához erősítsd meg az email-címed:`,
      'Email megerősítése',
      link,
      'Ha nem te regisztráltál, hagyd figyelmen kívül ezt a levelet.',
    );
    await this.send(to, subject, html, link);
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const link = `${this.appUrl}/jelszo-visszaallitas?token=${token}`;
    const subject = 'Jelszó visszaállítása – FőzzOkosan';
    const html = this.layout(
      `Szia ${this.escape(name)}!`,
      `Jelszó-visszaállítást kértél. Kattints az alábbi gombra az új jelszó beállításához. A link 1 óráig érvényes:`,
      'Új jelszó beállítása',
      link,
      'Ha nem te kérted, hagyd figyelmen kívül ezt a levelet – a jelszavad változatlan marad.',
    );
    await this.send(to, subject, html, link);
  }

  private async send(
    to: string,
    subject: string,
    html: string,
    link: string,
  ): Promise<void> {
    if (!this.transporter) {
      // Fallback fejlesztéshez: nincs SMTP, csak logoljuk a linket
      this.logger.warn(`[EMAIL NEM KÜLDVE – nincs SMTP] ${to} | ${subject}`);
      this.logger.warn(`[EMAIL LINK] ${link}`);
      return;
    }
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      this.logger.log(`Email elküldve: ${to} | ${subject}`);
    } catch (error) {
      this.logger.error(`Email küldési hiba (${to}): ${String(error)}`);
      throw error;
    }
  }

  private layout(
    greeting: string,
    intro: string,
    buttonText: string,
    link: string,
    footer: string,
  ): string {
    return `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#1f2937;">
  <h1 style="color:#f97316;font-size:22px;margin:0 0 16px;">FőzzOkosan</h1>
  <p style="font-size:16px;margin:0 0 8px;">${greeting}</p>
  <p style="font-size:15px;line-height:1.5;margin:0 0 20px;">${intro}</p>
  <p style="margin:0 0 20px;">
    <a href="${link}" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;">${buttonText}</a>
  </p>
  <p style="font-size:13px;color:#6b7280;line-height:1.5;margin:0 0 8px;">
    Ha a gomb nem működik, másold be ezt a linket a böngészőbe:<br>
    <a href="${link}" style="color:#f97316;word-break:break-all;">${link}</a>
  </p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
  <p style="font-size:12px;color:#9ca3af;margin:0;">${footer}</p>
</div>`.trim();
  }

  private escape(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
