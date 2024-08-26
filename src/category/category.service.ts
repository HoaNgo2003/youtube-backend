import { Injectable } from '@nestjs/common';
import { Category } from './entity/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private categoryReposity: Repository<Category>){}
  async getAllCategory():Promise<any>{
    return this.categoryReposity.find()
  }
  async create(category){
    return this.categoryReposity.save(category)
  }
}
