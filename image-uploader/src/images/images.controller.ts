import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    UsePipes,
    ValidationPipe,
    } from '@nestjs/common';
import { CreateImageDto } from './images.dtos';
import { ImagesService } from './images.service';

@Controller('images')
export class ImagesController {

    constructor(private readonly imageService: ImagesService) {}

    @Get()
    getImages(){
        return this.imageService.getAllImages();
    }

  @Post('create')
  @UsePipes(ValidationPipe)
  postImage(@Body() createImageDto: CreateImageDto) {
    return this.imageService.postImage(createImageDto);
  }
  
}
