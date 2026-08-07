import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
        avatarUrl: dto.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(dto.name)}`,
        settings: {
          create: {
            themeMode: 'system',
            accentColor: 'indigo',
          },
        },
      },
      include: {
        settings: true,
      },
    });

    // Seed default sample tasks for a new user
    await this.seedSampleTasks(user.id);

    const tokenInfo = this.generateToken(user.id, user.email);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokenInfo,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { settings: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenInfo = this.generateToken(user.id, user.email);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokenInfo,
    };
  }

  async guestLogin() {
    const guestEmail = 'guest.demo@taskmaster.app';
    let user = await this.prisma.user.findUnique({
      where: { email: guestEmail },
      include: { settings: true },
    });

    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('GuestPass123!', salt);
      user = await this.prisma.user.create({
        data: {
          email: guestEmail,
          name: 'Demo Guest User',
          passwordHash,
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuestUser',
          settings: {
            create: {
              themeMode: 'system',
              accentColor: 'indigo',
            },
          },
        },
        include: { settings: true },
      });

      await this.seedSampleTasks(user.id);
    }

    const tokenInfo = this.generateToken(user.id, user.email);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokenInfo,
    };
  }

  async googleLogin(googleUser: { email: string; name: string; avatarUrl?: string }) {
    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email.toLowerCase() },
      include: { settings: true },
    });

    if (!user) {
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email.toLowerCase(),
          name: googleUser.name,
          passwordHash: dummyPassword,
          avatarUrl: googleUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(googleUser.name)}`,
          settings: {
            create: {
              themeMode: 'system',
              accentColor: 'indigo',
            },
          },
        },
        include: { settings: true },
      });

      await this.seedSampleTasks(user.id);
    }

    const tokenInfo = this.generateToken(user.id, user.email);
    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokenInfo,
    };
  }

  private async seedSampleTasks(userId: string) {
    const count = await this.prisma.task.count({ where: { userId } });
    if (count > 0) return;

    const sampleTasks = [
      {
        title: 'Review AbleSpace Caseload UI Specs',
        description: 'Audit the current caseload table and Take Data workflows for optimal student tracking.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        category: 'Work',
        dueDate: new Date(Date.now() + 86400000 * 2), // 2 days from now
        userId,
      },
      {
        title: 'Design Dark Mode Design System Tokens',
        description: 'Craft harmonious CSS color variables for slate backgrounds, glassmorphic cards, and accent buttons.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        category: 'Design',
        dueDate: new Date(Date.now() - 86400000), // yesterday
        userId,
      },
      {
        title: 'Setup NestJS & Prisma PostgreSQL Backend',
        description: 'Configure Prisma schema models, JWT guards, REST endpoints, and pagination middleware.',
        status: 'COMPLETED',
        priority: 'URGENT',
        category: 'Development',
        dueDate: new Date(Date.now() - 86400000 * 2),
        userId,
      },
      {
        title: 'Implement Next.js Task Kanban Board',
        description: 'Add drag & drop support, status columns, filtering by priority, and fuzzy search.',
        status: 'TODO',
        priority: 'URGENT',
        category: 'Development',
        dueDate: new Date(Date.now() + 86400000 * 4),
        userId,
      },
      {
        title: 'Configure Vercel & Render Deployment Pipeline',
        description: 'Ensure automated builds, environment variable propagation, and CORS security settings.',
        status: 'TODO',
        priority: 'LOW',
        category: 'DevOps',
        dueDate: new Date(Date.now() + 86400000 * 7),
        userId,
      },
    ];

    for (const t of sampleTasks) {
      await this.prisma.task.create({ data: t });
    }
  }
}
