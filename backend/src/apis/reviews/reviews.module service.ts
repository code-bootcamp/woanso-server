// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Product } from './entities/product.entity';
// import { Review } from './entities/review.entity';
// import {
//   IProductsServiceCreate,
//   IProductsServiceFindOne,
//   IProductsServiceUpdate,
// } from './interfaces/products-service.interface';

// @Injectable()
// export class ReviewsService {
//   constructor(
//     @InjectRepository(Review)
//     private readonly reviewRepository: Repository<Review>,
//   ) {}

//   //전체조회
//   findAll(): Promise<Product[]> {
//     return this.productRepository.find();
//   }

//   findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
//     return this.productRepository.findOne({ where: { id: productId } });
//   }

//   create({ createProductInput }: IProductsServiceCreate): Promise<Product> {
//     const result = this.productRepository.save({ ...createProductInput });
//     // promise.all (){map}
//     return result;
//   }

//   update({
//     product,
//     updateProductInput,
//   }: // createUrlInput,
//   IProductsServiceUpdate): Promise<Product> {
//     return this.productRepository.save({
//       ...product, //
//       ...updateProductInput,
//     });
//   }

//   //삭제
//   async delete({ productId }) {
//     const result = await this.productRepository.softDelete({ id: productId });

//     return result.affected ? true : false;
//   }

//   async restore({ productId }) {
//     const result = await this.productRepository.restore({ id: productId });

//     return result.affected ? true : false;
//   }
// }
//     const result = this.productRepository.save({
//       ...product, //수정 후 수정되지 않은 다른 결과값까지 모두 받고 싶을 때 사용
//       ...updateProductInput,

//     });
//     return result;
//   }
