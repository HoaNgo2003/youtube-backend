import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Video } from './entity/video.entity';
 
import { ViewService } from 'src/view/view.service';
import { View } from 'src/view/entity/view.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User, Video, View])
  ],
  controllers: [VideoController],
  providers: [VideoService, ViewService]
})
export class VideoModule {}
