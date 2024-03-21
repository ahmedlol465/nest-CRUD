import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from 'src/DB/schemas/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {

  // Injecting JwtService and UserModel (User schema) using constructor injection
  constructor(
      private  jwtService: JwtService,
      @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Implementation of the canActivate method required by the CanActivate interface
  async canActivate(
    context: ExecutionContext,
  ): Promise<object> {
    // Extracting the request object from the execution context
    const req = context.switchToHttp().getRequest();

    // Extracting the 'accesstoken' from the request headers
    const { accesstoken } = req.headers;

    // Checking if the 'accesstoken' header exists in the request
    if (!accesstoken) {
        // Throwing a BadRequestException if 'accesstoken' is missing
        throw new BadRequestException('Please log in first');
    }

    // Checking if the 'accesstoken' has the correct prefix
    if (!accesstoken.startsWith('nest__')) {
        // Throwing a BadRequestException if the prefix is incorrect
        throw new BadRequestException('Wrong prefix');
    }

    // Extracting the token value by splitting the 'accesstoken' string
    const token = accesstoken.split('__')[1];

    // Verifying the token using JwtService to decode the data
    const decodedData = this.jwtService.verify(token, { secret: 'my-secret-login' });

    // Checking if the decoded data contains the '_id' property
    if (!decodedData._id) {
        // Throwing a BadRequestException if the token is invalid
        throw new BadRequestException('Wrong token');
    }

    // Finding the user in the database using the '_id' from the decoded data
    const user = await this.userModel.findById(decodedData._id);

    // Checking if the user exists in the database
    if (!user) {
        // Throwing a BadRequestException if the user does not exist
        throw new BadRequestException('Please sign up first');
    }

    // Storing the authenticated user in the request object for future use
    req.authUser = user;

    // Returning an object indicating that the request is allowed to proceed
    return { isActivated: true };
  }  
}
