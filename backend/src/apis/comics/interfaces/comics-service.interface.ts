import { CreateComicInput } from '../dto/createComic.input';

import { UpdateComicInput } from '../dto/update-comic.input';
import { Comic } from '../entities/comic.entity';

export interface IComicsServiceCreate {
  createComicInput: CreateComicInput;
}

export interface IComicsServiceFindOne {
  comicId: string;
}

export interface IComicsServiceUpdate {
  comic: Comic;
  updateComicInput: UpdateComicInput;
}

export interface IComicsServiceCheckSoldout {
  comic: Comic;
}

export interface IComicsServiceDelete {
  comicId: string;
}

export interface IComicsServicecheckOne {
  isAvailable: boolean;
}
