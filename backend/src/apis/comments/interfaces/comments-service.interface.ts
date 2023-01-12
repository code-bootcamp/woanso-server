import { IContext } from 'src/commons/types/context';
import { CreateCommentInput } from '../dto/create-comment.input';

export interface ICommentsServiceCreate {
  createCommentInput: CreateCommentInput;
  context?: IContext;
}

export interface ICommentsServiceFindOne {
  id: string;
}
