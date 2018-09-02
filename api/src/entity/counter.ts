import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity()
export class Counter {

  constructor() {
    this.id = 0;
    this.count = 0;
    this.content = '';
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  count: number;

  @Column()
  content: string;

  // @Column('timestamp', { name: 'created_at'})
  // createdAt: Date;

  // @Column('timestamp', { name: 'updated_at'})
  // updatedAt: Date;
}
