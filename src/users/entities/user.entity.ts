import { Exclude } from 'class-transformer';
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @CreateDateColumn({ nullable: true })
  @Exclude()
  createdAt: Date;

  @CreateDateColumn({ nullable: true })
  @Exclude()
  updatedAt: Date;

  @BeforeUpdate()
  private async update() {
    this.updatedAt = new Date();
  }
}
