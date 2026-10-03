import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

type Provider = 'resend' | 'sendgrid' | 'smtp' | 'none';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private provider: Provider = 'none';
  private transporter: nodemailer.Transporter | null = null;
  private readonly fromRaw: string;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly appUrl: string;
  private readonly resendKey?: string;
  private readonly sendgridKey?: string;

  constructor(private config: ConfigService) {
    this.fromRaw =
      this.config.get<string>('MAIL_FROM') ||
      'FőzzOkosan <no-reply@fozzokosan.local>';
    const parsed = this.parseFrom(this.fromRaw);
    this.fromEmail = parsed.email;
    this.fromName = parsed.name;

    this.appUrl = (
      this.config.get<string>('APP_URL') || 'http://localhost:3000'
    ).replace(/\/$/, '');

    this.resendKey = this.config.get<string>('RESEND_API_KEY') || undefined;
    this.sendgridKey = this.config.get<string>('SENDGRID_API_KEY') || undefined;
    const smtpHost = this.config.get<string>('SMTP_HOST');

    if (this.resendKey) {
      this.provider = 'resend';
    } else if (this.sendgridKey) {
      this.provider = 'sendgrid';
    } else if (smtpHost) {
      this.provider = 'smtp';
      this.transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(this.config.get<string>('SMTP_PORT') || '587', 10),
        secure: this.config.get<string>('SMTP_SECURE') === 'true',
        auth: {
          user: this.config.get<string>('SMTP_USER'),
          pass: this.config.get<string>('SMTP_PASS'),
        },
        // Gyors bukás, ha a kapcsolat nem jön létre (pl. blokkolt port)
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });
    }

    this.logger.log(`Email szolgáltató: ${this.provider}`);
    if (this.provider === 'none') {
      this.logger.warn(
        'Nincs email szolgáltató konfigurálva. Az emailek tartalma (link) a logba kerül.',
      );
    }
  }

  isConfigured(): boolean {
    return this.provider !== 'none';
  }

  async sendVerificationEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const link = `${this.appUrl}/verifikacio?token=${token}`;
    await this.send(
      to,
      'Erősítsd meg az email-címed – FőzzOkosan',
      this.layout(
        `Szia ${this.escape(name)}!`,
        'Köszönjük a regisztrációt a FőzzOkosanon. A fiókod aktiválásához erősítsd meg az email-címed:',
        'Email megerősítése',
        link,
        'Ha nem te regisztráltál, hagyd figyelmen kívül ezt a levelet.',
      ),
      link,
    );
  }

  async sendPasswordResetEmail(
    to: string,
    name: string,
    token: string,
  ): Promise<void> {
    const link = `${this.appUrl}/jelszo-visszaallitas?token=${token}`;
    await this.send(
      to,
      'Jelszó visszaállítása – FőzzOkosan',
      this.layout(
        `Szia ${this.escape(name)}!`,
        'Jelszó-visszaállítást kértél. Kattints a gombra az új jelszó beállításához. A link 1 óráig érvényes:',
        'Új jelszó beállítása',
        link,
        'Ha nem te kérted, hagyd figyelmen kívül ezt a levelet – a jelszavad változatlan marad.',
      ),
      link,
    );
  }

  private async send(
    to: string,
    subject: string,
    html: string,
    link: string,
  ): Promise<void> {
    switch (this.provider) {
      case 'resend':
        await this.sendViaResend(to, subject, html);
        break;
      case 'sendgrid':
        await this.sendViaSendgrid(to, subject, html);
        break;
      case 'smtp':
        await this.transporter!.sendMail({
          from: this.fromRaw,
          to,
          subject,
          html,
        });
        break;
      default:
        this.logger.warn(
          `[EMAIL NEM KÜLDVE – nincs szolgáltató] ${to} | ${subject}`,
        );
        this.logger.warn(`[EMAIL LINK] ${link}`);
        return;
    }
    this.logger.log(`Email elküldve (${this.provider}): ${to} | ${subject}`);
  }

  private async sendViaResend(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: this.fromRaw, to, subject, html }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      throw new Error(`Resend API ${res.status}: ${await res.text()}`);
    }
  }

  private async sendViaSendgrid(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.sendgridKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: this.fromEmail, name: this.fromName },
        subject,
        content: [{ type: 'text/html', value: html }],
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      throw new Error(`SendGrid API ${res.status}: ${await res.text()}`);
    }
  }

  private parseFrom(raw: string): { email: string; name: string } {
    const match = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
    if (match) {
      return { name: match[1] || 'FőzzOkosan', email: match[2].trim() };
    }
    return { name: 'FőzzOkosan', email: raw.trim() };
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
