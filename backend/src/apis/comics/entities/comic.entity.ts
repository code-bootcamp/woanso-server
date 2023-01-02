import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column({ default: 0, nullable: true })
  @Field(() => Float) // 별점을 줄 수 있도록 0.5 단위로 제한
  rating: number;

  // @Column()
  // @Field(() => String) // 시리즈이기 떄문에 각각 발해일이 다르기 때문에
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

  @Column()
  @Field(() => Int)
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // @ManyToOne(() => Category)
  // @Field(() => Category)
  // category: Category;

  ///////

  // @OneToMany(() => Image, (image) => image.comic)
  // @Field(() => [Image]) //graphql 방식
  // image: Image[];

  //   @ManyToOne(() => Origin)
  //   @Field(() => Origin)
  //   origin: Origin;

  //   @ManyToOne(() => Seller)
  //   @Field(() => Seller)
  //   seller: Seller;

  //   @ManyToOne(() => ProductSub)
  //   @Field(() => ProductSub)
  //   productsub: ProductSub;

  //   @JoinColumn() //FK키로 가져와서 참조할 때, 한쪽 테이블에만 적어주기 / 1대 1
  //   @OneToOne(() => Order)
  //   @Field(() => Order)
  //   order: Order;

  //   @JoinTable()
  //   @ManyToMany(() => Color, (colors) => colors.products)
  //   @Field(() => [Color])
  //   colors: Color[];
}
