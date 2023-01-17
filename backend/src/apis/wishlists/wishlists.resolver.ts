import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { CreateWishInput } from './dto/create-productwishlist.input';
import { Wishlist } from './entities/wishlish.entity';
import { WishlistService } from './wishlists.service';

@Resolver()
export class WishlistResolver {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Wishlist])
  async fetchWishlist(): Promise<Wishlist[]> {
    return this.wishlistService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async createWishlist(
    @Args('createWishInput')
    createWishInput: CreateWishInput,
  ) {
    return this.wishlistService.create({
      createWishInput,
    });
  }
}
