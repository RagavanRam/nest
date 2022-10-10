import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/base-entity';

@Entity('forms-datum')
export class FormsDatum extends BaseEntity {
  @Column({ type: 'json', nullable: false })
  data: JSON;

  @Column({ type: 'int', nullable: false, default: 0 })
  stage: number;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'submitted',
  })
  status: string;

  @Column({ type: 'json', default: [], array: true })
  logs: JSON;
}
