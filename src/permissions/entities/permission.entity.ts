import { BaseEntity } from 'src/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('permission')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'boolean', nullable: false })
  status: boolean;
}
