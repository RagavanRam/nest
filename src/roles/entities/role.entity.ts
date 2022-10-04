import { BaseEntity } from 'src/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('role')
export class Role extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  status: boolean;
}
