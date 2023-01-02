import { Args, Resolver, Query, Mutation, ID, Int } from '@nestjs/graphql';
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

  // 검색기능
  // @Query(() => [Comic])
  // fetchComicsWithTitle(@Args('title') title: string) {
  //   return this.comicsService.findWithTitle({ title });
  // }

  @Query(() => Comic)
  fetchComic(
    @Args('comicId') comicId: string, //
  ): Promise<Comic> {
    return this.comicsService.findOne({ comicId });
  }

  //대여가능 , 대여불가 수량 조회
  @Query(() => [Int])
  availableComic() {
    return this.comicsService.findAll1();
  }

  //------------------------------------------------//

  //생성;

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
  @Mutation(() => Comic)
  createComic(
    @Args('createComicInput') createComicInput: CreateComicInput, //
  ): Promise<Comic> {
    return this.comicsService.create({ createComicInput });
  }
}
