import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { VideoModule } from './video/video.module';
import { Video } from './video/entity/video.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entity/category.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthGuard } from './auth/auth.guard';
import { ViewModule } from './view/view.module';
import { View } from './view/entity/view.entity';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      envFilePath:".env",
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type:"mongodb",
      url: process.env.MONGO_URL,
      synchronize: true,
      logging: true,
      entities: [User, Video, Category, View]
    }),
    TypeOrmModule.forFeature([User, View])
    ,
    AuthModule,
    VideoModule,
    CategoryModule,
    ViewModule,
    ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
    provide: APP_GUARD,
    useClass: RolesGuard
  }
    
  ],
})
export class AppModule {}
