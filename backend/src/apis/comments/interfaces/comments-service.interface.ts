import { CreateCommentInput } from '../dto/create-comment.input';

export interface ICommentsServiceCreate {
  createCommentInput: CreateCommentInput;
}

export interface ICommentsServiceFindOne {
  id: string;
}
