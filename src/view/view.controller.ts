import { Controller, Post } from '@nestjs/common';
import { View } from './entity/view.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Public } from 'src/auth/public.decorate';

@Controller('view')
export class ViewController {
    
     
}
