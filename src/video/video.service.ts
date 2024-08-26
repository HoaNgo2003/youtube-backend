import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { CreateVideoDto } from './dto/video.create.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import {    Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { UpdateVideoDto } from './dto/update.dto';
import { Video } from './entity/video.entity';
import { View } from 'src/view/entity/view.entity';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class VideoService {
  constructor(@InjectRepository(User) private userResposity: Repository<User>,
  @InjectRepository(Video) private videoRespository: Repository<Video>,
  @InjectRepository(View) private viewRepository: Repository<View>){}
  async create(email: string, createVideoDto:CreateVideoDto ): Promise<Video>{
    const user = await this.userResposity.findOneBy({email})
    try {
      const res = await this.videoRespository.save({...createVideoDto,userId: user.id, view: 0})
      return res;
    } catch (error) {
      throw new HttpException("Can not create video", HttpStatus.BAD_REQUEST)
    }
  }
   

  async findAllVideo(keyword: string):Promise<any>{ 
     
    // const search = querydto.search;
    // const videos = await this.videoRespository.find({
    //    where:{
    //    title: search
    //    },
    //     relations:['user'],
    //     select:{
    //       user:{
    //         email: true,
    //         username: true
    //       }
    //     },
    //     order:{create_at: "desc"}
    // })

    const videos = await this.videoRespository.find();
    if(keyword){
      const filterVideo = videos.filter(video=>video.title.toLocaleLowerCase().includes(keyword.toLocaleLowerCase()))
      return filterVideo
    }
     return videos
  }
  async findVideoById(id: string): Promise<any>{
    const videoID = new ObjectId(id)
    try {
      const video = await this.videoRespository.findOneById(videoID);
      return video 
    } catch (error) {
      throw new HttpException("Not found video", HttpStatus.NOT_FOUND)
    }
  }
  async updateVideo(id: string, updateVideoDto: UpdateVideoDto):Promise<any>{
    const videoId = new ObjectId(id)
    try {
      const video = await this.findVideoById(id)
      console.log(video)
      if(!video){
        throw new HttpException("video not found", HttpStatus.NOT_FOUND)
      }
       await this.videoRespository.update(videoId, updateVideoDto);
      return {message: "update video success"};
    } catch (error) {
      throw new HttpException("can not update video", HttpStatus.BAD_REQUEST)
    }
  }
  async deleteVideo(id: string):Promise<any>{
    try {
    
      await this.videoRespository.delete(new ObjectId(id))
      return {message: "delete video success"}
    } catch (error) {
      throw new HttpException("Can not delete video", HttpStatus.BAD_REQUEST)
    }
  }
  async updateVideoLink(id: string, link: string):Promise<any>{
    const videoId = new ObjectId(id);
    const video = await this.findVideoById(id)
    const updateVideo = {...video, link:link}
    return await this.videoRespository.update(videoId, updateVideo);
  }
  
  async updateVideoView(id: string):Promise<any>{
    const videoId = new ObjectId(id)
    let maxTry = 1000;
    let uuid; 
    while(maxTry > 0){
      try {
        const video = await this.videoRespository.findOneBy({id:videoId})
        uuid = video.uuid
        const update = await this.videoRespository.update({id: videoId, uuid: uuid}, {
          ...video,
          view: video.view+1,
          uuid: uuidv4()
        })
        if(update.affected === 1){
          const newView = await this.viewRepository.save({
            videoId: videoId,
            view: 1
          })
          return {
            message:"update success"
          }
        }
        console.log(update)
      } catch (error) {
        console.log(error)
      } 
      maxTry--;
    }
    
    return {
      message:"update fail"
    }
    
  }
  async getViewByTime(id: string, start: string, end: string):Promise<any>{
    const views = await this.viewRepository.find({
      where: {
          videoId: new ObjectId(id),
      },
  })
    const startDay = new Date(start)
    const endDay = new Date(end)
    let count = 0;
    console.log(startDay, endDay)
    console.log(views.length)
    views.forEach(view => {
      if(view.created_at >= startDay && view.created_at <= endDay){
        count += 1;
      }
    });
    return {view: count};
  }
  
}
