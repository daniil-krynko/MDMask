export class CreateUserDto {
    username: string;
    password: string;
    email: string;
    refreshToken?: string;
}
export default CreateUserDto;