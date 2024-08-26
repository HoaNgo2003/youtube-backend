import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type VideoDocument = HydratedDocument<Video1>;

@Schema({timestamps: true, versionKey: '__v' })
export class Video1 {
  @Prop()
  title: string
  @Prop()
  image: string
  @Prop()
  description: string
  @Prop()
  link: string
  @Prop()
  view: number
  @Prop()
  create_at: Date
  
  @Prop()
  userId: string
  
  @Prop()
  categoryId: string
}

export const VideoSchema = SchemaFactory.createForClass(Video1);