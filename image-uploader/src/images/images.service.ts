import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './images.entity';
import { UpdateResult, DeleteResult } from  'typeorm';
import { CreateImageDto } from './images.dtos';
@Injectable()
export class ImagesService {
    constructor(
        @InjectRepository(Image) private readonly imageRepository: Repository<Image>,
      ) {}
      
      async getAllImages(){
        const allImages=await this.imageRepository.find({
          select: {
              id: true,
              imageUrl: true,
          }});
        return allImages
      }

      postImage(createImage:CreateImageDto) {
        const newImage = this.imageRepository.create(createImage);
        return this.imageRepository.save(newImage);
      }
}
