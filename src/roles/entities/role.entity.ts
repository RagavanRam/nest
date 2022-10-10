import { BaseEntity } from 'src/base-entity';
import { Rolesandpermission } from 'src/rolesandpermissions/entities/rolesandpermission.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  status: boolean;

  @OneToMany(
    () => Rolesandpermission,
    (rolesandpermissions) => rolesandpermissions.role,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  permissions: Role[];

  @OneToMany(() => User, (user) => user.role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  users: User[];
}
