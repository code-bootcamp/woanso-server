import { Args, Resolver, Query, Mutation, ID } from '@nestjs/graphql';
import { ComicsService } from './comics.service';
import { CreateComicInput } from './dto/createComic.input';
import { CreateUrlInput } from './dto/createUrl.input';
import { UpdateComicInput } from './dto/update-comic.input';
import { Comic } from './entities/comic.entity';

@Resolver()
export class ComicsResolver {
  constructor(private readonly comicsService: ComicsService) {}

  //조회
  @Query(() => [Comic])
  fetchComics() {
    return this.comicsService.findAll();
  }

  @Query(() => Comic)
  fetchComic(
    @Args('comicId') comicId: string, //
  ): Promise<Comic> {
    return this.comicsService.findOne({ comicId });
  }

  // @Query(() => Comic)
  // availableComic(
  //   @Args('comicId') comicId: string, // //: Promise<Comic>
  // ) {
  //   return this.comicsService.findOne({ isAvailable });
  // }

  //------------------------------------------------//

  //생성;
  @Mutation(() => Comic)
  createComic(
    @Args('createComicInput') createComicInput: CreateComicInput, //
  ): Promise<Comic> {
    return this.comicsService.create({ createComicInput });
  }

  //수정
  @Mutation(() => Comic)
  async updateComic(
    @Args('comicId') comicId: string,
    @Args('updateComicInput') updateComicInput: UpdateComicInput, //
    @Args('createUrlInput') CreateUrlInput: CreateUrlInput,
  ): Promise<Comic> {
    const comic = await this.comicsService.findOne({ comicId });

    return this.comicsService.update({ comic, updateComicInput });
  }

  //삭제
  @Mutation(() => Boolean)
  deleteComic(@Args('comicId', { type: () => ID }) comicId: string) {
    return this.comicsService.delete({ comicId });
  }

  @Mutation(() => Boolean)
  restoreComic(@Args('comicId', { type: () => ID }) comicId: string) {
    return this.comicsService.restore({ comicId });
  }
}
