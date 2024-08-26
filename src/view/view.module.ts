import { Module } from '@nestjs/common';
import { ViewService } from './view.service';
import { ViewController } from './view.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { View } from './entity/view.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([View])
  ],
  providers: [ViewService],
  controllers: [ViewController],
  exports:[ViewService]
})
export class ViewModule {}
