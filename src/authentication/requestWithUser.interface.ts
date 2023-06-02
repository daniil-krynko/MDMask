import { Request } from 'express';
import { User } from 'src/users/schema/user.schema';
 
interface RequestWithUser extends Request {
  user: User;
}
 
export default RequestWithUser;