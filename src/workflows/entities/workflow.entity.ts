import { BaseEntity } from 'src/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('workflows')
export class Workflow extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'json', nullable: false, array: true })
  workflow: JSON;

  @Column({ type: 'varchar', nullable: false, default: true })
  status: boolean;
}
