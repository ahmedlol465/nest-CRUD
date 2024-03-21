import { IsString, MinLength,IsEnum, IsNotEmpty } from 'class-validator'

export class signupBodyDto {
   @IsString()
   @MinLength(3, {
       message: 'name is too short'
   })
   name: string // typeScript

   @IsString()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string


    @IsString()
    @IsEnum(['male', 'female'])
    gender: string
}