import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/base-entity';
import { Workflow } from 'src/workflows/entities/workflow.entity';
import { FormsDatum } from 'src/forms-data/entities/forms-datum.entity';

@Entity('forms')
export class Form extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'json', nullable: false })
  config: JSON;

  @Column({
    type: 'boolean',
    nullable: false,
    default: true,
  })
  status: boolean;

  @JoinColumn()
  @ManyToOne(() => Workflow, (workflow) => workflow.forms, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  workflow: Workflow;

  @OneToMany(() => FormsDatum, (formsDatum) => formsDatum.form)
  formsDatum: FormsDatum[];
}
