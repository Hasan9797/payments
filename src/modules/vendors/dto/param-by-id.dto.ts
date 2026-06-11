import { IsEnum, IsIn, IsString } from 'class-validator';

export class ParamById {
  @IsIn(['id'])
  id: number;
}
