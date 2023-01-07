import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comic } from '../comics/entities/comic.entity';

import { Wishlist } from './entities/wishlish.entity';
import { WishlistResolver } from './wishlists.resolver';
import { WishlistService } from './wishlists.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Comic])],
  providers: [WishlistResolver, WishlistService],
})
export class WishlistModule {}
