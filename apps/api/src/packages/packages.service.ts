import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PackagesService {
  constructor(private readonly db: PrismaService) {}

  list(kind?: string) {
    return this.db.package.findMany({
      where: {
        status: 'PUBLISHED',
        ...(kind ? { kind: kind as any } : {}),
      },
      orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async get(slug: string) {
    const p = await this.db.package.findFirst({
      where: { slug: String(slug).trim(), status: 'PUBLISHED' },
    });
    if (!p) throw new NotFoundException('Package not found');
    return p;
  }

  async create(data: any, user: any) {
    if (!data.title || !data.slug || !data.destination || !data.duration || !data.summary) {
      throw new BadRequestException('Title, slug, destination, duration, and summary are required');
    }
    const slug = String(data.slug).toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (!slug) throw new BadRequestException('Valid package slug is required');

    const existing = await this.db.package.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`A package with slug "${slug}" already exists`);
    }

    const kind = String(data.kind || 'TOUR').toUpperCase();
    if (!['TOUR', 'HAJJ', 'UMRAH'].includes(kind)) {
      throw new BadRequestException('Package type must be TOUR, HAJJ, or UMRAH');
    }

    const price = data.priceFrom == null || data.priceFrom === '' ? null : Number(data.priceFrom);
    if (price !== null && (!Number.isSafeInteger(price) || price < 0)) {
      throw new BadRequestException('Starting price must be a non-negative whole number');
    }

    try {
      const p = await this.db.package.create({
        data: {
          title: String(data.title).trim(),
          slug,
          destination: String(data.destination).trim(),
          duration: String(data.duration).trim(),
          summary: String(data.summary).trim(),
          description: data.description ? String(data.description).trim() : null,
          kind: kind as any,
          category: data.category ? String(data.category).trim() : null,
          priceFrom: price,
          currency: data.currency || 'INR',
          featured: !!data.featured,
          image: data.image || null,
          details: data.details || undefined,
          departureDates: data.departureDates || undefined,
          itinerary: data.itinerary || undefined,
          inclusions: data.inclusions || undefined,
          exclusions: data.exclusions || undefined,
          status: 'DRAFT',
        },
      });

      await this.db.auditLog.create({
        data: {
          actorId: user.id,
          actorLabel: user.email,
          action: 'PACKAGE_CREATED',
          entity: 'Package',
          entityId: p.id,
          after: { title: p.title, status: p.status },
        },
      });

      return p;
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException(`A package with slug "${slug}" already exists`);
      }
      throw e;
    }
  }

  async update(id: string, data: any, user: any) {
    const old = await this.db.package.findUnique({ where: { id } });
    if (!old) throw new NotFoundException('Package not found');

    if (data.kind !== undefined && !['TOUR', 'HAJJ', 'UMRAH'].includes(String(data.kind).toUpperCase())) {
      throw new BadRequestException('Package type must be TOUR, HAJJ, or UMRAH');
    }
    if (data.status !== undefined && !['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(data.status)) {
      throw new BadRequestException('Invalid package status');
    }

    if (
      data.priceFrom !== undefined &&
      data.priceFrom !== null &&
      data.priceFrom !== '' &&
      (!Number.isSafeInteger(Number(data.priceFrom)) || Number(data.priceFrom) < 0)
    ) {
      throw new BadRequestException('Starting price must be a non-negative whole number');
    }

    if (data.slug !== undefined) {
      const newSlug = String(data.slug).toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
      if (newSlug !== old.slug) {
        const conflict = await this.db.package.findUnique({ where: { slug: newSlug } });
        if (conflict) {
          throw new ConflictException(`A package with slug "${newSlug}" already exists`);
        }
        data.slug = newSlug;
      }
    }

    if (data.status === 'PUBLISHED') {
      const candidate = {
        title: data.title ?? old.title,
        destination: data.destination ?? old.destination,
        duration: data.duration ?? old.duration,
        summary: data.summary ?? old.summary,
      };
      if (
        Object.values(candidate).some(
          (v) => !String(v || '').trim() || /to be confirmed|placeholder|add approved/i.test(String(v)),
        )
      ) {
        throw new BadRequestException(
          'Replace placeholder content and complete required package information before publishing',
        );
      }
    }

    const allowed = [
      'title',
      'slug',
      'destination',
      'duration',
      'summary',
      'description',
      'kind',
      'category',
      'priceFrom',
      'currency',
      'image',
      'featured',
      'sortOrder',
      'status',
      'departureDates',
      'itinerary',
      'inclusions',
      'exclusions',
      'details',
    ];

    const safe: any = {};
    for (const k of allowed) {
      if (data[k] !== undefined) safe[k] = data[k];
    }
    if (safe.priceFrom !== undefined) {
      safe.priceFrom = safe.priceFrom === null || safe.priceFrom === '' ? null : Number(safe.priceFrom);
    }

    try {
      const p = await this.db.package.update({ where: { id }, data: safe });
      await this.db.auditLog.create({
        data: {
          actorId: user.id,
          actorLabel: user.email,
          action: 'PACKAGE_UPDATED',
          entity: 'Package',
          entityId: p.id,
          before: { status: old.status, title: old.title },
          after: { status: p.status, title: p.title },
        },
      });
      return p;
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new ConflictException('A package with this slug already exists');
      }
      throw e;
    }
  }

  async delete(id: string, user: any) {
    const old = await this.db.package.findUnique({ where: { id } });
    if (!old) throw new NotFoundException('Package not found');
    await this.db.package.delete({ where: { id } });
    await this.db.auditLog.create({
      data: {
        actorId: user.id,
        actorLabel: user.email,
        action: 'PACKAGE_DELETED',
        entity: 'Package',
        entityId: id,
        before: { title: old.title, slug: old.slug },
      },
    });
    return { success: true, message: 'Package deleted successfully' };
  }
}
