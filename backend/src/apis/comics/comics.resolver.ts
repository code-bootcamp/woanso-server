import { Args, Resolver, Query, Mutation, ID, Int } from '@nestjs/graphql';
import { ComicsService } from './comics.service';
import { CreateComicInput } from './dto/createComic.input';

import { UpdateComicInput } from './dto/update-comic.input';
import { Comic } from './entities/comic.entity';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CACHE_MANAGER, Inject, UseGuards } from '@nestjs/common';
import { GqlAdminGuard } from 'src/commons/auth/gql-auth.guard';

@Resolver()
export class ComicsResolver {
  constructor(
    private readonly comicsService: ComicsService,

    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

  //------------------**[모든 만화 조회]**------------------
  @Query(() => [Comic])
  fetchComics() {
    return this.comicsService.findAll({});
  }

  //------------------**[제목으로 만화검색]**------------------
  @Query(() => [Comic])
  fetchComicsWithTitle(
    @Args('title') title: string,
    @Args('page') page: number,
  ) {
    return this.comicsService.findWithTitle({ title, page });
  }

  //------------------**[만화조회]**------------------
  @Query(() => Comic)
  fetchComic(
    @Args('comicId') comicId: string, //
  ): Promise<Comic> {
    return this.comicsService.findOne({ comicId });
  }

  //------------------**[대여 가능 / 불가능 만화 수량 확인]**------------------
  @Query(() => [Int])
  availableComicsForAdmin() {
    return this.comicsService.findAll1();
  }

  //------------------**[만화 업데이트]**------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Comic)
  async updateComic(
    @Args('comicId') comicId: string,
    @Args('updateComicInput') updateComicInput: UpdateComicInput, //
  ): Promise<Comic> {
    const comic = await this.comicsService.findOne({ comicId });

    return this.comicsService.update({ comic, updateComicInput });
  }

  //------------------**[만화 삭제]**------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Boolean)
  deleteComic(@Args('comicId', { type: () => ID }) comicId: string) {
    return this.comicsService.delete({ comicId });
  }

  //------------------**[만화 등록]**------------------
  @UseGuards(GqlAdminGuard)
  @Mutation(() => Comic)
  createComic(
    @Args('createComicInput') createComicInput: CreateComicInput, //
  ): Promise<Comic> {
    return this.comicsService.create({ createComicInput });
  }
}
