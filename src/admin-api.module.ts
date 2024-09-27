import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    AdminModule,
    RouterModule.register([
      {
        path: 'api/admin',
        module: AdminModule,
      },
    ]),
  ],
})
export class AdminApiModule {}
