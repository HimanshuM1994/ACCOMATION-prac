import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { InvoiceItem } from './invoice-item.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  invoiceNumber: string;

  @Column()
  fromName: string;

  @Column()
  fromEmail: string;

  @Column()
  fromAddress: string;

  @Column()
  toName: string;

  @Column()
  toEmail: string;

  @Column()
  toAddress: string;

  @Column({ type: 'date' })
  invoiceDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  taxRate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: 'draft' })
  status: string; // draft, sent, paid, overdue

  @ManyToOne(() => User, user => user.invoices)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => InvoiceItem, item => item.invoice, { cascade: true })
  items: InvoiceItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}