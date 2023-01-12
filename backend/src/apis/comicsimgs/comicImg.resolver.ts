import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ComicImgService } from './comicImg.service';
import { ComicImg } from './entities/comicsimg.entity';

@Resolver()
export class ComicImgResolver {
  constructor(
    private readonly comicImgService: ComicImgService, //
  ) {}

  @Query(() => [ComicImg])
  fetchBoardImage(
    @Args('comicId') comicId: string, //
  ) {
    return this.comicImgService.findBycomicId({ comicId });
  }

  @Query(() => [ComicImg])
  fetchAllCrewBoardImages() {
    return this.comicImgService.findAll();
  }
  @Mutation(() => [ComicImg])
  async uploadComicImg(
    @Args({ name: 'url', type: () => [String] }) url: string[],
    @Args('comicId') comicId: string,
  ) {
    return this.comicImgService.upload({ url, comicId });
  }
}
