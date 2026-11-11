import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/auth.guard';
import { LoginRateGuard } from '../common/login-rate.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @UseGuards(LoginRateGuard)
  @Post('login')
  login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    return this.auth.login(body, res);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const isSecure = process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
    const sameSiteMode = (process.env.COOKIE_SAME_SITE as 'lax' | 'strict' | 'none') || 'lax';

    res.clearCookie('skyray_session', {
      path: '/',
      httpOnly: true,
      secure: isSecure,
      sameSite: sameSiteMode,
    });
    return { ok: true, message: 'Signed out successfully' };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Req() req: Request) {
    return (req as any).user;
  }
}
