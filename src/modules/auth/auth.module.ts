import { Module } from '@nestjs/common';
import { AuthAdminController } from './auth-admin.controller';
import { AuthWebController } from './auth-web.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/utils/strategy/jwt.strategy';
import { RefreshTokenStrategy } from 'src/common/utils/strategy/refreshToken.strategy';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRETE_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthAdminController, AuthWebController],
  providers: [JwtStrategy, RefreshTokenStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
