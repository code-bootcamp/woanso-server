import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ComicImg } from 'src/apis/comicsimgs/entities/comicsImg.entity';
import { ComicRating } from 'src/apis/comicsRating/entities/comicRating.entity';
import { PointTransaction } from 'src/apis/payments/entities/payment.entity';
import { Wishlist } from 'src/apis/wishlists/entities/wishlish.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum COMIC_CATEGORY_ENUM {
  romance = 'romance',
  drama = 'drama',
  fantasy = 'fantasy',
  action = 'action',
  school = 'school',
  horror = 'horror',
}

registerEnumType(COMIC_CATEGORY_ENUM, {
  name: 'COMIC_CATEGORY_ENUM',
});

@Entity()
@ObjectType()
export class Comic {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  comicId: string;

  @Column({ nullable: true })
  @Field(() => String)
  title: string;

  @Column({ nullable: true, default: 0 })
  @Field(() => Int)
  deliveryFee: number;

  @Column({ nullable: true, default: 0 })
  @Field(() => Int)
  rentalFee: number;

  @Column({ nullable: true })
  @Field(() => String)
  author: string;

  @Column({ nullable: true })
  @Field(() => String)
  illustrator: string;

  @Column({ nullable: true })
  @Field(() => String)
  publisher: string;

  // @Column({ default: 0, nullable: true })
  // @Field(() => Float) // 별점을 줄 수 있도록 0.5 단위로 제한
  // rating: number;

  // @Column()
  // @Field(() => String) // 시리즈이기 떄문에 각각 발행일이 다르기 때문에
  // publicationDate: string;

  @Column()
  @Field(() => Int)
  totalBooks: number;

  @Column()
  @Field(() => String)
  description: string;

  @Column()
  @Field(() => String)
  ISBN: string;

  @Column({ default: true })
  @Field(() => Boolean)
  isAvailable: boolean;

  @Column({ default: 0 })
  @Field(() => Int)
  wishListCount: number;

  @Column()
  //@Field(() => Int)
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @JoinColumn()
  @OneToOne(() => ComicRating)
  @Field(() => ComicRating)
  comicRating: ComicRating;

  @JoinColumn()
  @OneToOne(() => PointTransaction)
  @Field(() => PointTransaction)
  pointTransaction: PointTransaction;

  @Field(() => COMIC_CATEGORY_ENUM)
  @Column({ type: 'enum', enum: COMIC_CATEGORY_ENUM, nullable: true })
  category: string;

  //@JoinColumn()
  @OneToMany(() => ComicImg, (comicImg) => comicImg.comic)
  @Field(() => [ComicImg])
  comicImg?: ComicImg[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.comic)
  @Field(() => [Wishlist])
  wishlist?: Wishlist[];
}
