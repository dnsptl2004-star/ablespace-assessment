import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsIn(['light', 'dark', 'system'])
  themeMode?: string;

  @IsOptional()
  @IsIn(['indigo', 'emerald', 'violet', 'amber', 'cyan'])
  accentColor?: string;

  @IsOptional()
  @IsBoolean()
  compactMode?: boolean;
}
