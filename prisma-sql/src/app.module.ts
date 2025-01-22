import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomConfigModule } from './config';
import { UploadModule } from './upload/upload.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

import { PassportModule } from '@nestjs/passport';
import { JwtGlobalModule } from './helper/jwt.strategy';
import { DatabaseModule } from './database/database.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // for public visible files
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // Expose files via /uploads/<filename>
    }),
    JwtGlobalModule,
    PassportModule,
    CustomConfigModule,
    UploadModule,
    DatabaseModule,
    PrismaModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
