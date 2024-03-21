import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/schemas/user.schema";
import * as bycrypt from 'bcrypt'; // Importing bcrypt for password hashing
import { SendEmailService } from "../../common/serviece/send-email-serviexe"; // Importing email sending service
import { JwtService } from "@nestjs/jwt"; // Importing JWT service

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>, // Injecting User model
        private sendEmailService: SendEmailService, // Injecting email sending service
        private jwtService: JwtService // Injecting JWT service
    ) {}

    
    /**
     * Handles user sign-up
     * 
     * @param req - Request object
     * @returns The created user
     * Steps:
     * 1. Get the user data from the request
     * 2. Check if email already exists
     * 3. If exists, return error
     * 4. Create the user
     */
    async signUpService(req: any) {
        const { name, email, password } = req.body; // Extracting user data from request body
        const isEmailExist = await this.userModel.findOne({email}); // Checking if email already exists
        if(isEmailExist) {
            throw new ConflictException('Email already exists');
        }
        const hashPassword =  bycrypt.hashSync(password, 10); // Hashing the password
        
        const token = this.jwtService.sign({email}, {secret: 'my-secret', expiresIn: '1d'}); // Generating JWT token for email confirmation

        const confirmationLink = `${req.protocol}://${req.headers.host}/auth/confirm-email?email=${token}`; // Creating confirmation link
        // Sending confirmation email
        const isSendEmail =  await this.sendEmailService.sendEmail(email, 'hello', `<a href=${confirmationLink}>click here</a>`);
        if(!isSendEmail) {
            throw new InternalServerErrorException('Email not sent');
        }
        // Creating the user in the database
        const user = await this.userModel.create({name, email, password: hashPassword, isEmailVerified: false, cPass: hashPassword});
        return user;
    }

    /**
     * Handles user login
     * 
     * @param req - Request object
     * @returns JWT token for authentication
     */
    async logInServiece(req: any) {
        const {email, password} = req.body; // Extracting email and password from request body
        const user = await this.userModel.findOne({email}); // Finding user by email
        if(!user){
            throw new BadRequestException('Invalid email');
        } 
        const isPasswordMatch = bycrypt.compareSync(password, user.password); // Comparing passwords
        if(!isPasswordMatch) {
            throw new UnauthorizedException('Invalid password');
        }
        // Generating JWT token
        const token = this.jwtService.sign({email, _id: user._id}, {secret: 'my-secret-login', expiresIn: '1d'});
        return token;
    }

    /**
     * Verifies user email
     * 
     * @param req - Request object
     * @returns The verified user
     */
    async verifyEmail(req: any) {
        const {token} = req.query; // Extracting token from request query
        const decodedData = this.jwtService.verify(token, {secret: 'my-secret'}); // Verifying token
        // Updating user email verification status
        const user = await this.userModel.findByIdAndUpdate({email: decodedData.email, isEmailVerified: false}, {isEmailVerified: true});
        if(!user) {
            throw new BadRequestException('User not found');
        }
        return user;
    }

    /**
     * Updates user information
     * 
     * @param req - Request object
     * @returns The updated user
     */
    async updateUser(req: any) {
        const { _id } = req.authUser; // Extracting user ID from request's authenticated user
        const { email, password, name } = req.body; // Extracting email, password, and name from request body

        // Check if email already exists
        const isEmailDuplicated = await this.userModel.findOne({ email });
        if (isEmailDuplicated) {
            throw new BadRequestException('Email already exists');
        }
    
        // Find user by ID
        const user = await this.userModel.findById(_id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if(password){
            // Compare passwords
            const isPasswordMatch = bycrypt.compareSync(password, user.password);
            if (isPasswordMatch) {
                throw new UnauthorizedException('Invalid password');
            }
        }
    
        // Hash the new password
        const hashPassword = password ? bycrypt.hashSync(password, 10) : undefined
      
        // Update user
        const updateUser = await this.userModel.findByIdAndUpdate(
            _id,
            { email, password: hashPassword, name ,cPass: hashPassword,},
            { new: true }
        );
        
    
        if (!updateUser) {
            throw new BadRequestException('Error updating user');
        }
    
        return updateUser;
    }
    

            /**
             * Deletes user account
             * 
             * @param req - Request object
             * @returns The deleted user
             */
            async deleteUser(req: any) {
                const { _id } = req.authUser; // Extracting user ID from request's authenticated user
                const isEmailFound = await this.userModel.findById(_id); // Checking if user exists
                if(!isEmailFound) {
                    throw new BadRequestException('User not found');
                }
                const user = await this.userModel.findByIdAndDelete(_id); // Deleting user
                if(!user) {
                    throw new BadRequestException('Error deleting user');
                }
                return user;
            }
        
            /**
             * Gets user data
             * 
             * @param req - Request object
             * @returns User data
             */
            async getUserData(req: any) {
                const { _id } = req.authUser; // Extracting user ID from request's authenticated user
                const user  = await this.userModel.findById(_id); // Finding user by ID
                if(!user) {
                    throw new BadRequestException('User not found');
                }        
                return user;
            }
        }
        