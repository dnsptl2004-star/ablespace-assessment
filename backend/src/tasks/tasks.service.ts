import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status || 'TODO',
        priority: dto.priority || 'MEDIUM',
        category: dto.category || 'Work',
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        userId,
      },
    });
  }

  async findAll(userId: string, query: QueryTaskDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };

    if (query.status && query.status !== 'ALL') {
      where.status = query.status;
    }

    if (query.priority && query.priority !== 'ALL') {
      where.priority = query.priority;
    }

    if (query.category && query.category !== 'ALL') {
      where.category = query.category;
    }

    if (query.search && query.search.trim() !== '') {
      const searchLower = query.search.trim();
      where.OR = [
        { title: { contains: searchLower, mode: 'insensitive' } },
        { description: { contains: searchLower, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    orderBy[sortBy] = sortOrder;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(userId: string, id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.userId !== userId) {
      throw new ForbiddenException('Access denied to this task');
    }

    return task;
  }

  async update(userId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(userId, id);

    const updateData: any = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.priority !== undefined) updateData.priority = dto.priority;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.dueDate !== undefined) {
      updateData.dueDate = dto.dueDate ? new Date(dto.dueDate) : null;
    }

    return this.prisma.task.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    return this.prisma.task.delete({
      where: { id },
    });
  }

  async getStats(userId: string) {
    const now = new Date();

    const [
      total,
      completed,
      inProgress,
      todo,
      overdue,
      urgent,
      high,
      medium,
      low,
    ] = await Promise.all([
      this.prisma.task.count({ where: { userId } }),
      this.prisma.task.count({ where: { userId, status: 'COMPLETED' } }),
      this.prisma.task.count({ where: { userId, status: 'IN_PROGRESS' } }),
      this.prisma.task.count({ where: { userId, status: 'TODO' } }),
      this.prisma.task.count({
        where: {
          userId,
          status: { not: 'COMPLETED' },
          dueDate: { not: null, lt: now },
        },
      }),
      this.prisma.task.count({ where: { userId, priority: 'URGENT' } }),
      this.prisma.task.count({ where: { userId, priority: 'HIGH' } }),
      this.prisma.task.count({ where: { userId, priority: 'MEDIUM' } }),
      this.prisma.task.count({ where: { userId, priority: 'LOW' } }),
    ]);

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      overdue,
      completionRate,
      priorityCounts: {
        URGENT: urgent,
        HIGH: high,
        MEDIUM: medium,
        LOW: low,
      },
    };
  }
}

