import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { MongooseModule } from "@nestjs/mongoose";
import { Photo, PhotoDocument, PhotoSchema } from "./schema/photo.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Photo', schema: PhotoSchema }])],
  controllers: [PhotosController],
  providers: [PhotosService],
  exports: [PhotosService],
})
export class PhotosModule {}
