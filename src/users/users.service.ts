import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./schema/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

  async getUserById(id: string): Promise<UserDocument> {
    return await this.userModel.findById(id).exec();
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
}
