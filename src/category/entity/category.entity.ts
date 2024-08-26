import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class Category{
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  name: string

  @Column()
  value: string
  @CreateDateColumn()
  create_at: Date
  
}