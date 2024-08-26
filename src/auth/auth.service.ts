import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { UserRegisterDto } from './dto/user.register.dto';
import * as bcrypt from "bcrypt"
import { LoginUserDto } from './dto/user.login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from './role.enum';
@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRespository: Repository<User>,
  private jwtService: JwtService,
  private configService: ConfigService
){}
  async registerUser(registerDto: UserRegisterDto): Promise<User>{
    const {password} = registerDto;
    const hashPass = await bcrypt.hash(password, 10);
    console.log(hashPass)
    const user = await this.userRespository.findOne({
       where:{
        email: registerDto.email
       }
    })
    if(user){
      throw new HttpException("Email da ton tai", HttpStatus.BAD_REQUEST);
    }
    return  this.userRespository.save({...registerDto, role:Role.User, password: hashPass 
    });
  }
  async loginUser(loginUser: LoginUserDto): Promise<any>{
    const {email, password} = loginUser;
    const user = await this.userRespository.findOne({
      where:{email}
    })
    if(!user){
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }
     
    const checkPass = await bcrypt.compare(password, user.password)
    if(!checkPass){
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST)
    }
    const payload = {email: user.email, username: user.username}
    return  this.generateToken(payload);
  }
  async generateToken(payload:{email: string, username: string}){
    const access_token = await this.jwtService.signAsync(payload);
    return {access_token}
  }
  
}
