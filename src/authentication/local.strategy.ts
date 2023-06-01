import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { User } from 'src/users/schema/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authenticationService: AuthenticationService) {
        super({usernameField:'email'});
    }
    
    //For every strategy, Passport calls the validate function using a set of parameters specific for a particular strategy. 
    //For the local strategy, Passport needs a method with a username and a password. In our case, the email acts as a username.
    async validate(email: string, password: string): Promise<User> {
        return this.authenticationService.getAuthenticatedUser(email, password);
    }
}