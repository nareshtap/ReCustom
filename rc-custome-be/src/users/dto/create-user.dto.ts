import { IsString, IsEmail, IsIn } from 'class-validator';

export class CreateUserDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsIn(['Admin', 'User'])
    role: string;
}
