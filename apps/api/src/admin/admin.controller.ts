import {
  BadRequestException,
  ConflictException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { AuthGuard, Roles, RolesGuard } from '../common/auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { EnquiriesService } from '../enquiries/enquiries.service';

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly db: PrismaService,
    private readonly enquiries: EnquiriesService,
  ) {}

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER', 'CONTENT_MANAGER', 'AUDITOR')
  @Get('dashboard')
  async dashboard() {
    const [total, n, p, contacted, q, c, closed, notInterested] = await Promise.all([
      this.db.enquiry.count(),
      this.db.enquiry.count({ where: { status: 'NEW' } }),
      this.db.enquiry.count({ where: { status: 'PENDING' } }),
      this.db.enquiry.count({ where: { status: 'CONTACTED' } }),
      this.db.enquiry.count({ where: { status: 'QUOTED' } }),
      this.db.enquiry.count({ where: { status: 'CONFIRMED' } }),
      this.db.enquiry.count({ where: { status: 'CLOSED' } }),
      this.db.enquiry.count({ where: { status: 'NOT_INTERESTED' } }),
    ]);
    return {
      total,
      new: n,
      pending: p,
      contacted,
      quoted: q,
      confirmed: c,
      closed,
      notInterested,
    };
  }

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER', 'AUDITOR')
  @Get('enquiries')
  list(@Query() q: any) {
    return this.enquiries.list(q);
  }

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER')
  @Patch('enquiries/:id/status')
  status(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.enquiries.changeStatus(id, body.status, (req as any).user);
  }

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER')
  @Post('enquiries/:id/notes')
  note(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.enquiries.addNote(id, body.note, (req as any).user);
  }

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER')
  @Patch('enquiries/:id/assign')
  assign(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    return this.enquiries.assign(id, body.assignedAdminId, (req as any).user);
  }

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER', 'AUDITOR')
  @Get('enquiries/export')
  async export(@Res() res: Response) {
    const rows = await this.db.enquiry.findMany({ orderBy: { createdAt: 'desc' } });
    const esc = (v: any) => {
      let s = String(v ?? '');
      if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
      return `"${s.replace(/"/g, '""')}"`;
    };
    const headers = [
      'Enquiry ID',
      'Submission Date',
      'Customer Name',
      'Phone Number',
      'Email',
      'Number of Members',
      'Package Name',
      'Travel Date',
      'Number of Days',
      'Instructions',
      'Enquiry Status',
    ];
    const lines = [
      headers,
      ...rows.map((x) => [
        x.reference,
        x.createdAt.toISOString(),
        x.fullName,
        x.phone,
        x.email,
        x.members,
        x.packageNameSnapshot,
        x.preferredDate.toISOString().slice(0, 10),
        x.days,
        x.instructions,
        x.status,
      ]),
    ].map((r) => r.map(esc).join(','));

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="SkyRay_Holidays_Enquiries.csv"');
    res.send('\ufeff' + lines.join('\r\n'));
  }

  // Allow all staff roles to read packages so the console doesn't 403
  @Roles('SUPER_ADMIN', 'CONTENT_MANAGER', 'ENQUIRY_MANAGER', 'AUDITOR')
  @Get('packages')
  packages() {
    return this.db.package.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER')
  @Get('jobs')
  jobs() {
    return this.db.integrationJob.findMany({
      include: { enquiry: { select: { reference: true } } },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  @Roles('SUPER_ADMIN')
  @Post('jobs/:id/retry')
  retry(@Param('id') id: string) {
    return this.db.integrationJob.update({
      where: { id },
      data: { status: 'PENDING', attempts: 0, lastError: null, nextAttemptAt: new Date() },
    });
  }

  @Roles('SUPER_ADMIN', 'ENQUIRY_MANAGER')
  @Get('staff-directory')
  staffDirectory() {
    return this.db.adminUser.findMany({
      where: { active: true, role: { in: ['SUPER_ADMIN', 'ENQUIRY_MANAGER', 'CONTENT_MANAGER'] } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });
  }

  @Roles('SUPER_ADMIN')
  @Get('users')
  users() {
    return this.db.adminUser.findMany({
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Roles('SUPER_ADMIN')
  @Get('audit')
  audit() {
    return this.db.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 100 });
  }

  @Roles('SUPER_ADMIN')
  @Post('users')
  async addUser(@Body() b: any, @Req() req: Request) {
    if (!b.name || !b.email || !b.password || String(b.password).length < 14) {
      throw new BadRequestException('Name, email, and a password of at least 14 characters are required');
    }
    const role = b.role || 'ENQUIRY_MANAGER';
    if (!['SUPER_ADMIN', 'CONTENT_MANAGER', 'ENQUIRY_MANAGER', 'AUDITOR'].includes(role)) {
      throw new BadRequestException('Invalid staff role');
    }
    const normalizedEmail = String(b.email).toLowerCase().trim();
    const existing = await this.db.adminUser.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      throw new ConflictException('A staff account with this email address already exists');
    }

    try {
      const u = await this.db.adminUser.create({
        data: {
          name: String(b.name).trim(),
          email: normalizedEmail,
          passwordHash: await bcrypt.hash(String(b.password), 12),
          role,
        },
      });
      await this.db.auditLog.create({
        data: {
          actorId: (req as any).user.id,
          actorLabel: (req as any).user.email,
          action: 'STAFF_CREATED',
          entity: 'AdminUser',
          entityId: u.id,
        },
      });
      return { id: u.id, name: u.name, email: u.email, role: u.role };
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException('A staff account with this email address already exists');
      }
      throw e;
    }
  }

  @Roles('SUPER_ADMIN')
  @Patch('users/:id/access')
  access(@Param('id') id: string, @Body() b: any) {
    return this.db.adminUser.update({
      where: { id },
      data: { active: !!b.active },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
  }
}
