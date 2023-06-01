import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PhotosModule } from './photos/photos.module';
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    UsersModule,
    PhotosModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        
        //We describe our expiration time in seconds to increase security. 
        //If someone’s token is stolen, the attacker has access to the application in a similar way to having a password. 
        //Due to the expiry time, the issue is partially dealt with because the token will expire.
        JWT_EXPIRATION_TIME: Joi.string().required(),
      })
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
