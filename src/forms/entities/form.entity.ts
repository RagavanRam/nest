import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/base-entity';

@Entity('forms')
export class Form extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'json', nullable: false })
  config: JSON;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  status: boolean;
}
