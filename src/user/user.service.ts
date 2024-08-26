import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { ObjectId } from 'mongodb';
@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userResposity: Repository<User>){}
    async findAllUser():Promise<User[]>{
        return await this.userResposity.find(
            {
                select:['id', 'username', 'email', 'created_at','role']
            }
        )
    }
    async finUserById(id: string): Promise<User>{
         const user = await this.userResposity.findOneById(new ObjectId(id));
         if(!user){
            throw new HttpException("User not found", HttpStatus.NOT_FOUND)
         }
         return user
    }
    
    async deleteUserById(id: string): Promise<any>{
        try {
            const user = await this.userResposity.findOneById(new ObjectId(id));
            return this.userResposity.delete(user)
             
        } catch (error) {
            throw new HttpException('User not found', HttpStatus.BAD_REQUEST)
        }
    }
}
