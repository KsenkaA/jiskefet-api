/*
 * Copyright (C) 2018 Amsterdam University of Applied Sciences (AUAS)
 *
 * This software is distributed under the terms of the
 * GNU General Public Licence version 3 (GPL) version 3,
 * copied verbatim in the file "LICENSE"
 */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RunModule } from './modules/run.module';
import { RunController } from './controllers/run.controller';
import { RunService } from './services/run.service';
import { LogController } from './controllers/log.controller';
import { LogService } from './services/log.service';
import { LogModule } from './modules/log.module';
import { SubSystemController } from './controllers/subsystem.controller';
import { SubSystemModule } from './modules/subsystem.module';
import { SubSystemService } from './services/subsystem.service';
import { AttachmentModule } from './modules/attachment.module';
import { AttachmentController } from './controllers/attachment.controller';
import { AttachmentService } from './services/attachment.service';
import { UserController } from './controllers/user.controller';
import { SubSystemPermissionModule } from './modules/subsystem_permission.module';
import { SubSystemPermissionService } from './services/subsystem_permission.service';
import { AuthModule } from './modules/auth.module';
import { AuthController } from './controllers/auth.controller';
import { UserModule } from './modules/user.module';
import { UserService } from './services/user.service';
import { BCryptService } from './services/bcrypt.service';
import { AuthUtility } from './utility/auth.utility';
import { OverviewModule } from './modules/overview.module';
import { OverviewController } from './controllers/overview.controller';
import { OverviewService } from './services/overview.service';
import { InfoLogService } from './services/infolog.service';
import { InfoLogModule } from './modules/infolog.module';
import { TimeUtility } from './utility/time.utility';
import { GithubAuthService } from './services/github.auth.service';
import { CernAuthService } from './services/cern.auth.service';
import { AuthService } from './abstracts/auth.service.abstract';
import { SettingService } from './services/setting.service';
import { SettingController } from './controllers/setting.controller';
import { SettingModule } from './modules/setting.module';
import { CsvController } from './controllers/csv.controller';

let databaseOptions;
// Use a different database for running tests.
if (process.env.NODE_ENV === 'test') {
    databaseOptions = {
        type: process.env.TEST_DB_CONNECTION,
        host: process.env.TEST_DB_HOST,
        port: +process.env.TEST_DB_PORT,
        username: process.env.TEST_DB_USERNAME,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_DATABASE,
        entities: ['src/**/**.entity{.ts,.js}'],
        synchronize: process.env.TEST_DB_SYNCHRONIZE ? true : false,
        migrations: ['populate/*{.ts,.js}'],
        migrationsRun: true
    };
} else {
    databaseOptions = {
      type: process.env.TYPEORM_CONNECTION,
      host: process.env.TYPEORM_HOST,
      port: process.env.TYPEORM_PORT,
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      entities: ['src/**/**.entity{.ts,.js}'],
      logging: process.env.TYPEORM_LOGGING,
      synchronize: process.env.TYPEORM_SYNCHRONIZE ? true : false,
      migrations: ['src/migration/*{.ts,.js}']
      // what to do with the cli variable from ormconfig.json
    };
}

const authServiceProvider = {
    provide: AuthService,
    useClass: process.env.USE_CERN_SSO === 'true'
        ? CernAuthService
        : GithubAuthService,
};
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseOptions),
    RunModule,
    LogModule,
    AttachmentModule,
    SubSystemModule,
    UserModule,
    AuthModule,
    SubSystemPermissionModule,
    OverviewModule,
    InfoLogModule,
    SettingModule,
  ],
  controllers: [
    AppController,
    RunController,
    LogController,
    AttachmentController,
    SubSystemController,
    UserController,
    AuthController,
    OverviewController,
    SettingController,
    CsvController
  ],
  providers: [
    AppService,
    RunService,
    LogService,
    AttachmentService,
    SubSystemService,
    UserService,
    authServiceProvider,
    AuthUtility,
    BCryptService,
    SubSystemPermissionService,
    OverviewService,
    InfoLogService,
    TimeUtility,
    SettingService
  ],
})
export class AppModule { }
