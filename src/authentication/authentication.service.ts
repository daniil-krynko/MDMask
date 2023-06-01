import { UsersService } from "src/users/users.service";
import {RegisterDto} from "./dto/Register.dto"
import { HttpException, HttpStatus} from '@nestjs/common'
import { MongoError } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt/dist";
import { ConfigService } from "@nestjs/config";
import TokenPayload from "./tokenPayload.interface";


export class AuthenticationService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    public getCookieWithJwtToken(userId: string) {
        const payload: TokenPayload = {userId};
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);

        //      We use a try...catch statement here because there is an important case when it might fail. 
        //      If a user with that email already exists, the  usersService.createUser method throws an error. 
        //      Since our unique column cases it the error comes from Postgres.
        try {
            const createdUser = await this.usersService.createUser({
                ...registrationData, password: hashedPassword
            });
            createdUser.password = undefined;
            return createdUser;
        } catch(error) {
            if (error instanceof MongoError && error.code === 11000) {
                // Unique key violation error
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
              } else {
                // Other errors
                throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
              }
        }
    }

    public async getAuthenticatedUser(email:string, hashedPassword: string) {
        try {
            const user = await this.usersService.getUserByEmail(email);
            const isPasswordMatching = await bcrypt.compare(
                hashedPassword, user.password
            );
            if (!isPasswordMatching) {
                throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
            }
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }   

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieForLogout() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }
}