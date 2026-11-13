import { Module } from '@nestjs/common';
import {
  SettingsController,
  ContentController,
  VisasController,
} from './settings.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SettingsController, ContentController, VisasController],
})
export class SettingsModule {}
