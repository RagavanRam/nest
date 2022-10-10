import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesandpermissionsModule } from './rolesandpermissions/rolesandpermissions.module';
import { SharedModule } from './shared/shared.module';
import { WorkflowsModule } from './workflows/workflows.module';
import { FormsModule } from './forms/forms.module';
import { FormsDataModule } from './forms-data/forms-data.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    RolesModule,
    PermissionsModule,
    RolesandpermissionsModule,
    SharedModule,
    WorkflowsModule,
    FormsModule,
    FormsDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
