import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { Repository } from 'typeorm';
import { User } from "src/user/entity/user.entity";
import { IS_PUBLIC_KEY } from "./public.decorate";
import { Reflector } from "@nestjs/core";
@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService,
        private configService: ConfigService,
        private reflector: Reflector,
        @InjectRepository(User) private userResposity: Repository<User>
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (isPublic) {             
            return true;
          }
        const token = this.extracTokenFromHeader(request);
        if(!token){
            throw new UnauthorizedException();
        }     
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.configService.get<string>("JWT_SECRET")
                }
            )
            const user = await this.userResposity.findOneBy({email:payload.email})
            request['user_data'] = user;
            // request['user'] = payload;
        } catch (error) {
            
            throw new HttpException({
                status: 419,
                message:"Token invalid"
            }, 419)
        }
        return true
    }
    private extracTokenFromHeader(request: Request):string|undefined{
        const [type, token] = request.headers.authorization?.split(' ')??[];
        return type === 'Bearer' ? token : undefined;
    }
}