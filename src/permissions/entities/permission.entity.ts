import { BaseEntity } from 'src/base-entity';
import { Rolesandpermission } from 'src/rolesandpermissions/entities/rolesandpermission.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('permission')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false })
  status: boolean;

  @OneToMany(
    () => Rolesandpermission,
    (rolesandpermission) => rolesandpermission.permission,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  roles: Permission[];
}
