import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comic } from '../comics/entities/comic.entity';
import { Wishlist } from './entities/wishlish.entity';

export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,

    @InjectRepository(Comic)
    private readonly comicRepository: Repository<Comic>,
  ) {}

  async create({ createWishInput }) {
    const { userId, comicId } = createWishInput;
    const isDib = await this.wishlistRepository
      .createQueryBuilder()
      .select()
      .where('userId = :userId', { userId: userId })
      .andWhere('comicComicId = :comicComicId', {
        comicComicId: comicId,
      })
      .getOne();

    let checkDib = false;
    if (isDib) {
      //이미 찜목록에 있다면
      await this.wishlistRepository.save({
        wishlistId: isDib.wishlistId,
        comic: { comicId },
        user: { id: userId },
        isDib: isDib.isDib ? false : true,
      });
      checkDib = isDib.isDib ? false : true;
    } else {
      //처음클릭이라면
      await this.wishlistRepository.save({
        comic: { comicId },
        user: { id: userId },
        isDib: true,
      });
      checkDib = true;
    }

    const comic = await this.comicRepository.findOne({
      where: { comicId },
    });
    if (checkDib) {
      await this.comicRepository.save({
        comicId,
        wishListCount: comic.wishListCount + 1,
      });
    } else {
      await this.comicRepository.save({
        comicId,
        wishListCount: comic.wishListCount - 1,
      });
    }
    return checkDib;
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: ['user', 'comic'],
    });
  }
}
