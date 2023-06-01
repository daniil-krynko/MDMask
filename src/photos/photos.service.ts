import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Photo, PhotoDocument } from "./schema/photo.schema";

@Injectable()
export class PhotosService {
  constructor(@InjectModel('Photo') private photoModel: Model<PhotoDocument>) {}

  async getPhotoById(id: string): Promise<PhotoDocument> {
    return await this.photoModel.findById(id).exec();
  }

  async createPhoto(createPhotoDto: CreatePhotoDto): Promise<PhotoDocument> {
    return await (await this.photoModel.create(createPhotoDto)).save();
  }

  async updatePhoto(id: string, updatePhotoDto: UpdatePhotoDto): Promise<PhotoDocument> {
    return await (await this.photoModel.findByIdAndUpdate(id, updatePhotoDto).exec()).save();
  }

  async deletePhoto(id: string) {
    return await this.photoModel.findByIdAndDelete({ _id: id }).exec();
  }
}
