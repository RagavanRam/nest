import { Exclude } from 'class-transformer';
import {
  BeforeUpdate,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @CreateDateColumn({ nullable: true })
  @Exclude()
  createdAt: Date;

  @CreateDateColumn({ nullable: true })
  @Exclude()
  updatedAt: Date;

  @BeforeUpdate()
  private async atUpdate() {
    this.updatedAt = new Date();
  }
}
