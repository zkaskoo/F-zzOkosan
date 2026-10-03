import {
  Injectable,
  Logger,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { TokenType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

const VERIFICATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 óra
const RESET_TTL_MS = 60 * 60 * 1000; // 1 óra
const GENERIC_OK = {
  message:
    'Ha létezik fiók ezzel az email-címmel, elküldtük rá a szükséges levelet.',
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mail: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, bio } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Ez az email-cím már regisztrálva van');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, passwordHash, name, bio },
      select: { id: true, email: true, name: true },
    });

    await this.createAndSendVerification(user.id, user.email, user.name);

    return {
      requiresVerification: true,
      message:
        'Sikeres regisztráció! Küldtünk egy megerősítő emailt – kattints benne a linkre a belépéshez.',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Hibás email-cím vagy jelszó');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Hibás email-cím vagy jelszó');
    }

    if (!user.emailVerified) {
      throw new ForbiddenException(
        'Erősítsd meg az email-címed a belépéshez. Nézd meg a postaládád, vagy kérj új megerősítő emailt.',
      );
    }

    const token = this.generateToken(user.id, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      accessToken: token,
    };
  }

  async verifyEmail(token: string) {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (
      !record ||
      record.type !== TokenType.EMAIL_VERIFICATION ||
      record.expiresAt < new Date()
    ) {
      throw new BadRequestException(
        'Érvénytelen vagy lejárt megerősítő link. Kérj újat.',
      );
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      }),
      this.prisma.verificationToken.deleteMany({
        where: { userId: record.userId, type: TokenType.EMAIL_VERIFICATION },
      }),
    ]);

    return {
      message: 'Az email-címed sikeresen megerősítve. Most már beléphetsz.',
    };
  }

  async resendVerification(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && !user.emailVerified) {
      await this.prisma.verificationToken.deleteMany({
        where: { userId: user.id, type: TokenType.EMAIL_VERIFICATION },
      });
      await this.createAndSendVerification(user.id, user.email, user.name);
    }
    return GENERIC_OK;
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      await this.prisma.verificationToken.deleteMany({
        where: { userId: user.id, type: TokenType.PASSWORD_RESET },
      });
      const token = await this.createToken(
        user.id,
        TokenType.PASSWORD_RESET,
        RESET_TTL_MS,
      );
      try {
        await this.mail.sendPasswordResetEmail(user.email, user.name, token);
      } catch (error) {
        this.logger.error(
          `Jelszó-reset email küldése sikertelen (${user.email}): ${String(error)}`,
        );
      }
    }
    return GENERIC_OK;
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.prisma.verificationToken.findUnique({
      where: { token },
    });

    if (
      !record ||
      record.type !== TokenType.PASSWORD_RESET ||
      record.expiresAt < new Date()
    ) {
      throw new BadRequestException(
        'Érvénytelen vagy lejárt jelszó-visszaállító link. Kérj újat.',
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        // A jelszó-reset egyben bizonyítja az email-cím feletti kontrollt
        data: { passwordHash, emailVerified: true },
      }),
      this.prisma.verificationToken.deleteMany({
        where: { userId: record.userId, type: TokenType.PASSWORD_RESET },
      }),
    ]);

    return {
      message: 'A jelszavad megváltozott. Most már beléphetsz az újjal.',
    };
  }

  // ---- segédfüggvények ----

  private async createAndSendVerification(
    userId: string,
    email: string,
    name: string,
  ): Promise<void> {
    const token = await this.createToken(
      userId,
      TokenType.EMAIL_VERIFICATION,
      VERIFICATION_TTL_MS,
    );
    // Az email-küldés hibája NE buktassa el a regisztrációt – a felhasználó
    // létrejön, és később újraküldheti a megerősítő emailt.
    try {
      await this.mail.sendVerificationEmail(email, name, token);
    } catch (error) {
      this.logger.error(
        `Megerősítő email küldése sikertelen (${email}): ${String(error)}`,
      );
    }
  }

  private async createToken(
    userId: string,
    type: TokenType,
    ttlMs: number,
  ): Promise<string> {
    const token = randomBytes(32).toString('hex');
    await this.prisma.verificationToken.create({
      data: {
        userId,
        token,
        type,
        expiresAt: new Date(Date.now() + ttlMs),
      },
    });
    return token;
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email };
    return this.jwtService.sign(payload);
  }
}
