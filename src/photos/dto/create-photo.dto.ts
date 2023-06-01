import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreatePhotoDto {
    title: string;
    description: string;
    isSwapped: boolean;
    userOwner: CreateUserDto
}
