import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/base-entity';
import { Form } from 'src/forms/entities/form.entity';

@Entity('forms-datum')
export class FormsDatum extends BaseEntity {
  @Column({ type: 'json', nullable: false })
  formData: JSON;

  @Column({ type: 'int', nullable: false, default: 0 })
  stage: number;

  @Column({
    type: 'varchar',
    nullable: false,
    default: 'submitted',
  })
  status: string;

  @Column({ type: 'json', nullable: true })
  logs: object;

  @Column({ type: 'varchar', default: [], array: true })
  emails: string[];

  @JoinColumn()
  @ManyToOne(() => Form, (form) => form.formsDatum, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  form: Form;
}
