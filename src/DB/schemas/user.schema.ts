import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@Schema({timestamps: true})

export class User {
    @Prop({
        // required: true,
        type: String,
        trim: true,
        // lowerCase: true
    })
    name: string; // speciall in typeScript


    @Prop({
        required: true,
        type: String,
        trim: true,
        unique: true
    })
    email: string; // speciall in typeScript



    @Prop({
        required: true,
        type: String,

    })
    password: string; // speciall in typeScript

    @Prop({
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    })
    role: string; // speciall in typeScript

    
    @Prop({
        type: String,
        default: false
    })
    isEmailVerified: string; // speciall in typeScript

    @Prop({
        type: String,
    })
    cPass: string; // speciall in typeScript

    


}
export const UserSchema = SchemaFactory.createForClass(User)
