import { Module } from "@nestjs/common";
import { UserController } from "../../user/user.controller";
import { UserService } from "../../user/user.serviece";
import { JwtService } from "@nestjs/jwt"
import { ModelGeneration } from '../DB/model-generation'

@Module({
    controllers: [UserController],
    providers: [UserService, JwtService],
    imports: [ModelGeneration]
})
export class userModule {}