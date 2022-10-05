import { Role } from 'src/roles/entities/role.entity';

export interface UserInterface {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  role: Role;
}
