import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserImgService } from './userImg.service';
import { UserImg } from './entities/usersImg.entity';

@Resolver()
export class UserImgResolver {
  constructor(
    private readonly userImgService: UserImgService, //
  ) {}

  @Query(() => [UserImg])
  fetchUserImage(
    @Args('User') id: string, //
  ) {
    return this.userImgService.findByUserId({ id });
  }

  @Query(() => [UserImg])
  fetchAllUserImages() {
    return this.userImgService.findAll();
  }

  @Mutation(() => [UserImg])
  async UserImg(
    @Args({ name: 'url', type: () => [String] }) url: string[],
    @Args('userID') id: string,
  ) {
    return this.userImgService.upload({ url, id });
  }
}
