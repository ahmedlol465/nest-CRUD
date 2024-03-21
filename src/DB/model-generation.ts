import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';

export const ModelGeneration = MongooseModule.forFeature([
        {name: User.name, schema: UserSchema},

    ])


    