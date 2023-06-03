import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Response } from "express";
import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as childProcess from 'child_process';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) { }

  @Get(':filename')
  getImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = path.join(__dirname, '..',   'images', filename);
    res.sendFile(imagePath);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() photo:multer.Multer.File): Promise<string> {
    return await this.photosService.savePicture(photo);
  }

  @Post('swapFaces')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadImages(@UploadedFiles() images: multer.Multer.File[], @Res() res: Response) {
    const imageBuffer1 = images[0].buffer
    const imageBuffer2 = images[1].buffer
    const tempPhoto_1 = path.join(__dirname,  '..', 'temp', 'photo_1.png')
    const tempPhoto_2 = path.join(__dirname,  '..', 'temp', 'photo_2.png')
    fs.writeFileSync(tempPhoto_1, imageBuffer1);
    fs.writeFileSync(tempPhoto_2, imageBuffer2);
    const pythonScript = path.join(__dirname, '..', 'python', 'photos_face_swapping.py')
    const pythonProcess = childProcess.spawn('python', [pythonScript, tempPhoto_1, tempPhoto_2]);

    const directoryPath = path.join(__dirname, '..', 'swapped_face')
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return;
      }
      files.forEach((file) => {
        const filePath = path.join(directoryPath, file);

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return;
          }

          console.log('File deleted:', filePath);
        });
      });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString().trim());
    });
    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      if (code === 0) {
        fs.unlinkSync(tempPhoto_1);
        fs.unlinkSync(tempPhoto_2);
        console.log('Temporary image files deleted.');
        const imagePath = path.join(__dirname, '..', 'swapped_face')
        const imageSwappedName = fs.readdirSync(imagePath);

        res.send(imageSwappedName)
      }
    });
  }
}
