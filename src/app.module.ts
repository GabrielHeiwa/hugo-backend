import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { SessionService } from './session/session.service';
import { SessionGateway } from './session/session.gateway';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'poc', 'novnc')
    })
  ],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, UserService, SessionService, SessionGateway],
})
export class AppModule {}
