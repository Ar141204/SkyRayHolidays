import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnquiriesService {
  constructor(private readonly db: PrismaService) {}

  private generateReference(): string {
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = randomBytes(3).toString('hex').toUpperCase();
    return `SKY-${datePrefix}-${randomSuffix}`;
  }

  async create(d: any, key?: string) {
    if (key && key.length > 160) throw new BadRequestException('Idempotency key is too long');
    if (d.sourcePlatform && !['WEBSITE', 'ANDROID', 'IOS'].includes(d.sourcePlatform)) {
      throw new BadRequestException('Invalid source platform');
    }
    if (d.website) throw new BadRequestException('Invalid submission');
    if (!d.consent) throw new BadRequestException('Privacy acknowledgement is required');

    const date = new Date(d.preferredDate);
    if (Number.isNaN(date.getTime()) || date.getTime() < Date.now() - 86400000) {
      throw new BadRequestException('Choose a valid future travel date');
    }

    if (key) {
      const prior = await this.db.enquiry.findUnique({ where: { idempotencyKey: key } });
      if (prior) return { reference: prior.reference, status: prior.status, reused: true };
    }

    let pkg: any = null;
    if (d.packageId) {
      pkg = await this.db.package.findFirst({ where: { id: d.packageId, status: 'PUBLISHED' } });
      if (!pkg) {
        throw new BadRequestException('Selected package is unavailable; please refresh and choose again');
      }
    }

    let attempts = 0;
    while (attempts < 3) {
      attempts++;
      const ref = this.generateReference();

      try {
        const saved = await this.db.$transaction(async (tx) => {
          const e = await tx.enquiry.create({
            data: {
              reference: ref,
              fullName: d.fullName.trim(),
              phone: d.phone.trim(),
              email: d.email.trim().toLowerCase(),
              members: Number(d.members) || 1,
              packageId: pkg?.id,
              packageNameSnapshot: pkg?.title || d.packageName || 'Not sure yet',
              preferredDate: date,
              days: Number(d.days) || 1,
              instructions: d.instructions?.trim() || null,
              sourcePlatform: d.sourcePlatform || 'WEBSITE',
              idempotencyKey: key || undefined,
              consentAt: new Date(),
            },
          });

          await tx.enquiryStatusHistory.create({
            data: { enquiryId: e.id, toStatus: 'NEW', actorLabel: 'PUBLIC_SUBMISSION' },
          });

          for (const type of ['COMPANY_EMAIL', 'CUSTOMER_EMAIL', 'EXCEL_SYNC']) {
            await tx.integrationJob.create({
              data: { enquiryId: e.id, type, status: 'PENDING' },
            });
          }

          return e;
        });

        return { reference: saved.reference, status: saved.status };
      } catch (e: any) {
        if (e.code === 'P2002') {
          if (key) {
            const prior = await this.db.enquiry.findUnique({ where: { idempotencyKey: key } });
            if (prior) return { reference: prior.reference, status: prior.status, reused: true };
          }
          // If collision was on reference, loop and retry with fresh reference
          if (attempts < 3) continue;
        }
        throw e;
      }
    }
  }

  async list(q: any = {}) {
    const page = Math.max(1, Number(q.page) || 1);
    const take = Math.min(100, Math.max(1, Number(q.take) || 30));
    const where: any = {};

    if (q.status) where.status = q.status;
    if (q.packageId) where.packageId = q.packageId;
    if (q.search) {
      where.OR = [
        { reference: { contains: q.search, mode: 'insensitive' } },
        { fullName: { contains: q.search, mode: 'insensitive' } },
        { email: { contains: q.search, mode: 'insensitive' } },
        { phone: { contains: q.search } },
      ];
    }

    const [items, total] = await this.db.$transaction([
      this.db.enquiry.findMany({
        where,
        include: {
          assignedAdmin: { select: { name: true, email: true } },
          histories: { orderBy: { createdAt: 'desc' }, take: 10 },
          notes: { orderBy: { createdAt: 'desc' }, take: 20 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * take,
        take,
      }),
      this.db.enquiry.count({ where }),
    ]);

    return { items, total, page, take };
  }

  async changeStatus(id: string, status: string, user: any) {
    const allowed = ['NEW', 'PENDING', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'NOT_INTERESTED', 'CLOSED', 'SPAM'];
    if (!allowed.includes(status)) throw new BadRequestException('Invalid status');

    return this.db.$transaction(async (tx) => {
      const old = await tx.enquiry.findUnique({ where: { id } });
      if (!old) throw new NotFoundException('Enquiry not found');

      const next = await tx.enquiry.update({ where: { id }, data: { status: status as any } });
      await tx.enquiryStatusHistory.create({
        data: {
          enquiryId: id,
          fromStatus: old.status,
          toStatus: next.status,
          actorId: user.id,
          actorLabel: user.email,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: user.id,
          actorLabel: user.email,
          action: 'ENQUIRY_STATUS_CHANGED',
          entity: 'Enquiry',
          entityId: id,
          before: { status: old.status },
          after: { status: next.status },
        },
      });

      return next;
    });
  }

  async addNote(id: string, note: string, user: any) {
    if (!note?.trim() || note.length > 3000) {
      throw new BadRequestException('Enter a note under 3,000 characters');
    }
    const e = await this.db.enquiry.findUnique({ where: { id } });
    if (!e) throw new NotFoundException('Enquiry not found');

    const saved = await this.db.enquiryNote.create({
      data: { enquiryId: id, note: note.trim(), authorId: user.id },
    });

    await this.db.auditLog.create({
      data: {
        actorId: user.id,
        actorLabel: user.email,
        action: 'ENQUIRY_NOTE_ADDED',
        entity: 'Enquiry',
        entityId: id,
      },
    });

    return saved;
  }

  async assign(id: string, assignedAdminId: string | undefined, user: any) {
    if (assignedAdminId) {
      const staff = await this.db.adminUser.findFirst({ where: { id: assignedAdminId, active: true } });
      if (!staff) throw new BadRequestException('Select an active staff member');
    }

    const e = await this.db.enquiry.update({
      where: { id },
      data: { assignedAdminId: assignedAdminId || null },
    });

    await this.db.auditLog.create({
      data: {
        actorId: user.id,
        actorLabel: user.email,
        action: 'ENQUIRY_ASSIGNED',
        entity: 'Enquiry',
        entityId: id,
        after: { assignedAdminId: assignedAdminId || null },
      },
    });

    return e;
  }
}
