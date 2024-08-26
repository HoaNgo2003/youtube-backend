import { IsOptional, IsString } from "class-validator";

export class QueryVideo{
  @IsString()
  @IsOptional()
  search: string
}