import { Field, ObjectType } from '@nestjs/graphql';
import { Comic } from 'src/apis/comics/entities/comic.entity';
import { User } from 'src/apis/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Wishlist {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  wishlistId: string;

  @Column({ default: false })
  @Field(() => Boolean)
  isDib: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Field(() => User, { nullable: true })
  user: User;

  @ManyToOne(() => Comic, { onDelete: 'CASCADE' })
  @Field(() => Comic, { nullable: true })
  comic: Comic;
}
