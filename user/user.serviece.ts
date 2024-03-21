import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/schemas/user.schema";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ){}

    async getuserProfile(req: any){
        const { _id } = req.authUser
        const user = await this.userModel.findById(_id, 'email name role')
        if(!user){
            throw new BadRequestException('please signup first')
        }
        return user
    }
}