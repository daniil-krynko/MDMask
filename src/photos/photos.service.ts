import { Injectable } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Photo, PhotoDocument } from "./schema/photo.schema";
import * as path from "path";
import * as fs from "fs";
import * as multer from "multer";

@Injectable()
export class PhotosService {
  constructor(@InjectModel('Photo') private photoModel: Model<PhotoDocument>) { }

  async savePicture(file: multer.Multer.File): Promise<string> {
    const pictureName = `${Date.now()}-${file.originalname}`;
    const picturePath = `dist/images/${pictureName}`;

    // Create the directory if it doesn't exist
    if (!fs.existsSync('dist/images')) {
      fs.mkdirSync('dist/images', { recursive: true });
    }

    // Save the picture to the specified path
    fs.writeFileSync(picturePath, file.buffer);

    return picturePath;
  }
}
