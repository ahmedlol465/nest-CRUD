import { Module } from "@nestjs/common";
import { AuthController } from "../Auth/controller";
import { AuthService } from "../Auth/serviece";
import { ModelGeneration } from "../DB/model-generation";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "Guards/auth.guard";


@Module({
    imports: [ModelGeneration],
    controllers: [AuthController],
    providers: [AuthService, JwtService, AuthGuard],
})

export class AuthModule {}