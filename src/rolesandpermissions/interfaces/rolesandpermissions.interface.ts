import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';

export class RolesAndPermissionsInterface {
  id: number;
  role: Role;
  permission: Permission;
  manage: boolean;
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  createdAt: Date;
  updatedAt: Date;
}
