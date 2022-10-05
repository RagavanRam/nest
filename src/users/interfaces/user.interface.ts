import { RoleDto } from 'src/roles/dto';

export interface UserInterface {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: RoleDto;
}
