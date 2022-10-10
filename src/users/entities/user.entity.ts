import { Exclude } from 'class-transformer';
import { Role } from 'src/roles/entities/role.entity';
import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
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

  @JoinColumn()
  @ManyToOne(() => Role, (role) => role.users, { nullable: true })
  role: Role;

  @BeforeUpdate()
  private async atUpdate() {
    this.updatedAt = new Date();
  }
}
