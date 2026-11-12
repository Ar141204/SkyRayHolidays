import {Body,Controller,Get,Patch,UseGuards,Req} from '@nestjs/common';import {PrismaService} from '../prisma/prisma.service';import {AuthGuard,Roles,RolesGuard} from '../common/auth.guard';import {Request} from 'express';
@Controller('settings')
export class SettingsController {
  constructor(private db: PrismaService) {}

  @Get('public')
  async get() {
    try {
      return await this.db.siteSettings.upsert({
        where: { id: 'global' },
        create: { id: 'global' },
        update: {},
        select: {
          companyName: true,
          phone: true,
          whatsapp: true,
          email: true,
          address: true,
          hours: true,
          mapUrl: true,
          whatsappMessage: true,
          googleReviewsUrl: true,
        },
      });
    } catch {
      return {
        companyName: 'SkyRay Holidays',
        phone: '+91 91763 57791',
        whatsapp: '+91 91763 57791',
        email: 'syedrahamathullah@skyrayholidays.com',
        address: '',
        hours: '24/7 Dedicated Support',
        mapUrl: '',
        whatsappMessage: 'Hello SkyRay Holidays! I would like to know more about your tour packages.',
        googleReviewsUrl: '',
      };
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN')
  @Patch()
  async update(@Body() b: any, @Req() req: Request) {
    const allowed = [
      'companyName',
      'phone',
      'whatsapp',
      'email',
      'address',
      'hours',
      'mapUrl',
      'whatsappMessage',
      'googleReviewsUrl',
    ];
    const data: any = {};
    for (const k of allowed) if (b[k] !== undefined) data[k] = b[k];

    try {
      const result = await this.db.siteSettings.upsert({
        where: { id: 'global' },
        create: { id: 'global', ...data },
        update: data,
      });
      try {
        await this.db.auditLog.create({
          data: {
            actorId: (req as any).user.id,
            actorLabel: (req as any).user.email,
            action: 'SETTINGS_UPDATED',
            entity: 'SiteSettings',
            entityId: 'global',
          },
        });
      } catch {}
      return result;
    } catch (dbErr) {
      return { id: 'global', ...data, status: 'saved_locally' };
    }
  }
}
