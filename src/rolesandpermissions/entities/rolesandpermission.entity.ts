import { BaseEntity } from 'src/base-entity';
import { Permission } from 'src/permissions/entities/permission.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('rolesandpermissions')
export class Rolesandpermission extends BaseEntity {
  @JoinColumn()
  @ManyToOne(() => Role, (role) => role.permissions, { nullable: false })
  role: Role;

  @JoinColumn()
  @ManyToOne(() => Permission, (permission) => permission.roles, {
    nullable: false,
  })
  permission: Permission;

  @Column({ type: 'boolean', default: false, nullable: false })
  manage: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  create: boolean;

  @Column({ type: 'boolean', default: true, nullable: false })
  read: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  update: boolean;

  @Column({ type: 'boolean', default: false, nullable: false })
  delete: boolean;
}
