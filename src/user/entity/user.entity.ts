import { Role } from "../../auth/role.enum";
import { Column, CreateDateColumn, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  token: string;

  @Column()
  role: Role;
  @CreateDateColumn()
  created_at: Date;

   
}