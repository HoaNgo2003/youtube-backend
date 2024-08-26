import { Body, Controller, Get, Post, SetMetadata } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Public } from 'src/auth/public.decorate';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService){}
  @Public()
  @Get()
  getAllResposity():Promise<any>{
    return this.categoryService.getAllCategory()
  }
  @Post()
  createCategory(@Body() category){
    return this.categoryService.create(category)
  }
}
