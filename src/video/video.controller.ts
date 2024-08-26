import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Request, SetMetadata, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateVideoDto } from './dto/video.create.dto';
import { Video } from './entity/video.entity';
import { VideoService } from './video.service';
 
 
import { UpdateVideoDto } from './dto/update.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storageconfig } from 'src/helpers/config';
import { extname } from 'path';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/role.enum';
import { Public } from 'src/auth/public.decorate';

@ApiTags("Video")
@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService){}
  @ApiBearerAuth()
 
  @SetMetadata('roles', ['Admin'])
  @Post('create')
  @UseInterceptors(FileInterceptor('file',{storage: storageconfig('image-folder')  }),
  // FileInterceptor('video', {storage: storageconfig('video-folder')})
   
)
@ApiConsumes('multipart/form-data')
@ApiBody({
  schema: {
    type: 'object',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
      title:{
        type:"string"
      },
      link:{
        type:"string"
      },
      description:{
        type:"string"
      },
      categoryId:{
        type:"string"
      },
     
    },
  },
})
  createVideo(@Body() ceateVideoDto: CreateVideoDto, @Req() request,@UploadedFile() file:Express.Multer.File): Promise<Video>{
   
    ceateVideoDto = {...ceateVideoDto, image: file.destination+"/"+file.filename}
    return this.videoService.create(request['user_data'].email,ceateVideoDto);
  }
  @ApiBearerAuth()
 
  @SetMetadata('roles', ['Admin'])
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('video',{storage: storageconfig('video-folder')  }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadVideo(@Param('id') id:string,@UploadedFile() video: Express.Multer.File):Promise<Video>{
    const link = video.destination + "/"+ video.filename
    return this.videoService.updateVideoLink(id, link)
  }
  @Public()
  @Get()
  findAll(@Query('keyword') keyword:string):Promise<any>{
    return this.videoService.findAllVideo(keyword);
  }
  @Public()
  @Get(':id')
  getVideoById(@Param("id") id: string):Promise<Video>{
    return this.videoService.findVideoById(id)
  }
  @ApiBearerAuth()
  @SetMetadata('roles', ['Admin'])
  @Patch("/update/:id")
  
  updateVideo(@Param("id") id: string, @Body() updateVideo: UpdateVideoDto): Promise<any>{
    return this.videoService.updateVideo(id, updateVideo);
  }

  @ApiBearerAuth()
  @SetMetadata('roles', ['Admin'])
  @Delete("/delete/:id")
 
  deleteVideo(@Param("id") id: string):Promise<any>{
    
    return this.videoService.deleteVideo(id);
  }

  @Public()
  @Patch('/update/view/:id')
  updateVideoOfView(@Param('id') id: string):Promise<any>{
    return this.videoService.updateVideoView(id)
  }

  @Public()
  @Get('/view/:id')
  getView(@Param('id') id: string, 
  @Query('start') start: string,
  @Query('end') end: string
){
 return this.videoService.getViewByTime(id, start, end) 
}
  // @Post('upload-video-image/:id')
  // // @UseGuards(AuthGuard)
  // uploadVideo(@Param('id') id: string,@Request() req:any, @UploadedFile() file: Express.Multer.File ){
  //   if(req.fileValidationError){
  //     throw new BadRequestException(req.fileValidationError)
  //   }
  //   if(!file){
  //     throw new BadRequestException('File not found')
  //   }
  //   this.videoService.updateVideoLink(id, file.destination+'/'+file.filename)
  // }
}
