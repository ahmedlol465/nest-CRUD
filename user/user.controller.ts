import { Controller, Get, Res,Req , UseGuards } from "@nestjs/common";
import { AuthGuard } from "Guards/auth.guard";
import { Request, Response } from 'express';
import { UserService } from "./user.serviece";

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {    } 

    @Get('profile')
    @UseGuards(AuthGuard)
    async getUserProfile (
        @Req() req: Request,
        @Res() res: Response
    ) {
        const responce = await this.userService.getuserProfile(req)
        return res.status(200).json({
            message: 'user profile',
            date: responce

        })
    }
}