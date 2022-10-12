import { BaseEntity } from 'src/base-entity';
import { Form } from 'src/forms/entities/form.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('workflows')
export class Workflow extends BaseEntity {
  @Column({ type: 'varchar', unique: true, nullable: false })
  name: string;

  @Column({ type: 'json', nullable: false })
  workflow: JSON;

  @Column({ type: 'boolean', nullable: false, default: true })
  status: boolean;

  @OneToMany(() => Form, (form) => form.workflow)
  forms: Form[];
}
