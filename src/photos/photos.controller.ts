import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.createPhoto(createPhotoDto);
  }

  @Get(':id')
  getPhotoById(@Param('_id') id: string) {
    return this.photosService.getPhotoById(id);
  }

  @Patch(':id')
  updatePhoto(@Param('_id') id: string, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.updatePhoto(id, updatePhotoDto);
  }

  @Delete(':id')
  deletePhoto(@Param('_id') id: string) {
    return this.photosService.deletePhoto(id);
  }
}
