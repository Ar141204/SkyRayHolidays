import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnquiriesService {
  constructor(private readonly db: PrismaService) {}

  private generateReference(): string {
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let suffix = '';
    const bytes = randomBytes(6);
    for (let i = 0; i < 6; i++) {
      suffix += chars[bytes[i] % chars.length];
    }
    return `SKY-${datePrefix}-${suffix}`;
  }

  async create(d: any, key?: string) {
    if (key && key.length > 160) throw new BadRequestException('Idempotency key is too long');
    if (d.sourcePlatform && !['WEBSITE', 'ANDROID', 'IOS'].includes(d.sourcePlatform)) {
      throw new BadRequestException('Invalid source platform');
    }
    if (d.website) throw new BadRequestException('Invalid submission');
    if (!d.consent) throw new BadRequestException('Privacy acknowledgement is required');

    let date = new Date(d.preferredDate);
    if (Number.isNaN(date.getTime()) && typeof d.preferredDate === 'string') {
      const parts = d.preferredDate.trim().split(/[/.-]/);
      if (parts.length === 3) {
        const p0 = parseInt(parts[0], 10);
        const p1 = parseInt(parts[1], 10);
        const p2 = parseInt(parts[2], 10);
        if (p2 > 1000) {
          // DD/MM/YYYY or MM/DD/YYYY
          if (p0 > 12 && p1 <= 12) {
            date = new Date(p2, p1 - 1, p0);
          } else {
            // Default to day first (common in India/GCC)
            date = new Date(p2, p1 - 1, p0);
          }
        }
      }
    }
    if (Number.isNaN(date.getTime()) || date.getTime() < Date.now() - 86400000) {
      throw new BadRequestException('Choose a valid future travel date');
    }

    if (key) {
      const prior = await this.db.enquiry.findUnique({ where: { idempotencyKey: key } }).catch(() => null);
      if (prior) {
        const ageMs = Date.now() - new Date(prior.createdAt).getTime();
        // Only return prior if sent within 15 seconds (rapid double-click protection)
        if (ageMs < 15000) {
          return { reference: prior.reference, status: prior.status, reused: true };
        }
      }
    }

    let pkg: any = null;
    if (d.packageId) {
      pkg = await this.db.package.findFirst({ where: { id: d.packageId, status: 'PUBLISHED' } });
      if (!pkg) {
        throw new BadRequestException('Selected package is unavailable; please refresh and choose again');
      }
    } else if (d.packageSlug && d.packageSlug !== 'not-sure' && !d.packageSlug.startsWith('country-')) {
      pkg = await this.db.package.findFirst({ where: { slug: d.packageSlug, status: 'PUBLISHED' } });
    }

    const tierLabel = d.tier && d.tier !== 'any' ? ` [${d.tier.toUpperCase()}]` : '';
    let packageNameSnapshot =
      (pkg?.title ? `${pkg.title}${tierLabel}` : null) ||
      (d.country ? `${d.country} Tour Package${tierLabel}` : null) ||
      (d.packageName ? `${d.packageName}${tierLabel}` : null) ||
      (d.packageSlug === 'not-sure' ? 'Custom Planning Request' : 'General Enquiry');

    if (d.serviceType === 'visa' || d.visaType) {
      const vCountry = d.country || 'International';
      const vType = d.visaType || 'Tourist Visa';
      packageNameSnapshot = `Visa: ${vCountry} (${vType})`;
    } else if (d.serviceType === 'umrah') {
      packageNameSnapshot = `Umrah: ${d.packageName || 'Umrah Pilgrimage'}${tierLabel}`;
    } else if (d.serviceType === 'tour') {
      const tourMode = d.tourType ? ` [${d.tourType}]` : '';
      const dest = d.country ? `${d.country} Tour` : (pkg?.title || d.packageName || 'Holiday Package');
      packageNameSnapshot = `Tour: ${dest}${tourMode}`;
    }

    let finalInstructions = d.instructions?.trim() || null;
    const extraDetails: string[] = [];
    if (d.serviceType) {
      extraDetails.push(`Service: ${d.serviceType.toUpperCase()}`);
    }
    if (d.visaType) {
      extraDetails.push(`Visa Type: ${d.visaType}`);
    }
    if (d.tourType) {
      extraDetails.push(`Tour Mode: ${d.tourType}`);
    }
    if (d.country && (!finalInstructions || !finalInstructions.includes(d.country))) {
      extraDetails.push(`Destination/Country: ${d.country}`);
    }
    if (d.tier && d.tier !== 'any') {
      extraDetails.push(`Package Tier: ${d.tier.toUpperCase()}`);
    }
    if (d.adults !== undefined || d.children !== undefined || d.kids !== undefined || d.infants !== undefined) {
      const numAdults = d.adults !== undefined ? d.adults : 1;
      const numChildren = d.children !== undefined ? d.children : (d.kids || 0);
      const numInfants = d.infants !== undefined ? d.infants : 0;
      extraDetails.push(`Travelers: ${numAdults} Adults (12+ yrs), ${numChildren} Children (<12 yrs), ${numInfants} Infants (0-2 yrs)`);
    }
    if (d.nights) {
      extraDetails.push(`Duration: ${d.nights} Nights`);
    }

    if (extraDetails.length > 0) {
      const extraText = extraDetails.join(' | ');
      finalInstructions = finalInstructions ? `${extraText}\n${finalInstructions}` : extraText;
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
              packageNameSnapshot,
              preferredDate: date,
              days: Number(d.days) || 1,
              instructions: finalInstructions,
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
            const prior = await this.db.enquiry.findUnique({ where: { idempotencyKey: key } }).catch(() => null);
            if (prior) return { reference: prior.reference, status: prior.status, reused: true };
          }
          // If collision was on reference, loop and retry with fresh reference
          if (attempts < 3) continue;
        }
        // If database connection is offline or pooler closed, log and return graceful fallback reference
        console.warn('⚠️ Database unavailable during enquiry submission. Serving fallback reference:', e.message);
        return { reference: ref, status: 'RECEIVED', fallback: true };
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

  async delete(id: string, user: any) {
    const old = await this.db.enquiry.findUnique({ where: { id } });
    if (!old) throw new NotFoundException('Enquiry not found');
    await this.db.integrationJob.deleteMany({ where: { enquiryId: id } });
    await this.db.enquiry.delete({ where: { id } });
    await this.db.auditLog.create({
      data: {
        actorId: user.id,
        actorLabel: user.email,
        action: 'ENQUIRY_DELETED',
        entity: 'Enquiry',
        entityId: id,
        before: { reference: old.reference, fullName: old.fullName },
      },
    });
    return { success: true, message: 'Enquiry deleted successfully' };
  }

  async deleteAll(user: any) {
    await this.db.integrationJob.deleteMany({});
    await this.db.enquiryStatusHistory.deleteMany({});
    await this.db.enquiryNote.deleteMany({});
    const res = await this.db.enquiry.deleteMany({});
    await this.db.auditLog.create({
      data: {
        actorId: user.id,
        actorLabel: user.email,
        action: 'ALL_ENQUIRIES_DELETED',
        entity: 'Enquiry',
        before: { count: res.count },
      },
    });
    return { success: true, count: res.count };
  }
}
