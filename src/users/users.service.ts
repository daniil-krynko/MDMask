import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async getUsers(): Promise<UserDocument[]> {
    return await this.userModel.find().exec();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (user) {
      return user
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND)
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserDocument> {
    return await (await this.userModel.create(createUserDto)).save();
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
      return await (await this.userModel.findByIdAndUpdate(id, updateUserDto).exec()).save();
  }

  async deleteUser(id: string) {
      return await this.userModel.findByIdAndDelete({ _id: id }).exec();
  }

  async getUserByEmail (email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({email}).exec();
    if (user) {
      return user;
    } 
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND)
  }
}
