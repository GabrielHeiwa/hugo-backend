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
import { SessionController } from './session/session.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'poc', 'novnc')
    })
  ],
  controllers: [AppController, UserController, SessionController],
  providers: [AppService, PrismaService, UserService, SessionService, SessionGateway],
})
export class AppModule {}
