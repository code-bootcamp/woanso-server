import { Args, Resolver, Query, Mutation, ID, Int } from '@nestjs/graphql';
import { ComicsService } from './comics.service';
import { CreateComicInput } from './dto/createComic.input';
import { CreateUrlInput } from './dto/createUrl.input';
import { UpdateComicInput } from './dto/update-comic.input';
import { Comic } from './entities/comic.entity';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Resolver()
export class ComicsResolver {
  constructor(
    private readonly comicsService: ComicsService,
    private readonly elasticsearchService: ElasticsearchService,
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
  ) {}

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

  //----------------------------------*[Search comic]*------------------------------------------
  @Query(() => [Comic])
  async searchComics(
    @Args({ name: 'search', nullable: true, description: '검색어' })
    search: string, //
  ) {
    const comicCache = await this.cache.get(`searchUsers:${search}`);
    if (comicCache) return comicCache;

    const result = await this.elasticsearchService.search({
      index: 'user',
      query: { match: { title: search } },
    });
    console.log(JSON.stringify(result, null, ' '));
    const comics = result.hits.hits.map((el: any) => ({
      title: el._source.title,
      deliveryFee: el._source.deliveryfee,
      rentalFee: el._source.rentalfee,
      author: el._source.author,
      illustrator: el._source.illustrator,
      publisher: el._source.publisher,
    }));

    console.log(comics);

    // 엘라스틱 조회 결과가 있다면, 레디스에 결과 캐싱
    // await this.cache.set(`searchUsers:${search}`, comics, { ttl: 30 });
    return comics;
  }
  //----------------------------------*[Fetch Comic]*------------------------------------------
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
