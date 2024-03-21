import { Controller, Get, Post, Body, Res, Req, UsePipes, UseGuards, Delete, Put } from "@nestjs/common";
import { AuthService } from "../serviece/auth.serviece";
import { Request, Response } from 'express'; 
import { signupBodyDto } from "../auth.dto";
import { ZodValidationPipe } from "../../Pipes/validation.pipe";
import { loginSchema, signUpSchema } from "../auth.validationSchema";
import { AuthGuard } from "Guards/auth.guard";

@Controller("auth")
export class AuthController { 
    constructor(
        private readonly authService: AuthService
    ) {}

    // Sign up controller
    @Post('signUp')
    @UsePipes(new ZodValidationPipe(signUpSchema)) // Validation pipe for sign-up schema
    async signUpController(
        @Req() body: Request, // Request object containing user sign-up data
        @Res() res: Response // Response object for sending back the API response
    ) {
        const response = await this.authService.signUpService(body); // Call sign-up service in AuthService
        res.status(200).json({ // Return success response with created user data
            message: 'User created successfully', 
            data: response
        });
    }

    // Login controller
    @Post('login')
    @UsePipes(new ZodValidationPipe(loginSchema)) // Validation pipe for login schema
    async loginController(
        @Req() req: Request, // Request object containing user login data
        @Res() res: Response // Response object for sending back the API response
    ) {
        const response = await this.authService.logInServiece(req); // Call login service in AuthService
        res.status(200).json({ // Return success response with login token
            message: 'User logged in successfully',
            data: response
        });
    }

    // Verify email controller
    @Post('verifyEmail')
    async verifyEmail(
        @Req() req: Request, // Request object containing email verification token
        @Res() res: Response // Response object for sending back the API response
    ) {
        const response = await this.authService.verifyEmail(req); // Call email verification service in AuthService
        res.status(200).json({ // Return success response for email verification
            message: 'User verified email successfully',
        });
    }

    // Update user controller
    @Put('updatedUser')
    @UseGuards(AuthGuard) // Guard to authenticate user before updating
    async updatedUserController(
        @Req() req: Request, // Request object containing updated user data
        @Res() res: Response // Response object for sending back the API response
    ) {
        const response = await this.authService.updateUser(req); // Call update user service in AuthService
        res.status(200).json({ // Return success response for user update
            message: 'User updated successfully',
        });
    }

    // Delete user controller
    @Delete('deleteUser')
    @UseGuards(AuthGuard) // Guard to authenticate user before deletion
    async deleteUserController(
        @Req() req: Request, // Request object containing user deletion data
        @Res() res: Response // Response object for sending back the API response
    ) {
        const response = await this.authService.deleteUser(req); // Call delete user service in AuthService
        return res.status(200).json({ // Return success response for user deletion
            message: 'User deleted successfully',
        });
    }

    // Get user data controller
    @Get('getUserData')
    @UseGuards(AuthGuard) // Guard to authenticate user before fetching data
    async getUserData(
        @Req() req: Request, // Request object containing user data fetch request
        @Res() res: Response // Response object for sending back the API response
    ) {
        const response = await this.authService.getUserData(req); // Call get user data service in AuthService
        return res.status(200).json({ // Return success response with user data
            message: 'User data fetched successfully',
            data: response
        });
    }
}
