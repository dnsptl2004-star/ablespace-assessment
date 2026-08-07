import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { settings: true },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash, ...result } = user;
    return result;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const updateData: any = {};
    if (dto.name) updateData.name = dto.name;
    if (dto.avatarUrl) updateData.avatarUrl = dto.avatarUrl;
    if (dto.newPassword) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(dto.newPassword, salt);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: { settings: true },
    });

    const { passwordHash, ...result } = updated;
    return result;
  }

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await this.prisma.userSettings.create({
        data: {
          userId,
          themeMode: 'system',
          accentColor: 'indigo',
        },
      });
    }

    return settings;
  }

  async updateSettings(userId: string, dto: UpdateSettingsDto) {
    return this.prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        themeMode: dto.themeMode || 'system',
        accentColor: dto.accentColor || 'indigo',
        compactMode: dto.compactMode ?? false,
      },
      update: {
        ...(dto.themeMode && { themeMode: dto.themeMode }),
        ...(dto.accentColor && { accentColor: dto.accentColor }),
        ...(dto.compactMode !== undefined && { compactMode: dto.compactMode }),
      },
    });
  }
}
