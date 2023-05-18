import { TypeOrmModule } from "@nestjs/typeorm";
import { Image } from "../images/images.entity"

const entities = [Image];
export {Image};
export default entities;