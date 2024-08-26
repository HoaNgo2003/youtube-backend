import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, ObjectIdColumn } from "typeorm";

@Entity()
export class View{
    @ObjectIdColumn()
    id: ObjectId;
    @Column()
    videoId: ObjectId;
    @Column()
    view: number
    
    @CreateDateColumn()
    created_at: Date
}