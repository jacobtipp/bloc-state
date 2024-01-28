import { Post } from './model/post';

export abstract class PostClient {
  protected _!: void;
  abstract cancelPost(id: number): void;
  abstract getPostDetails(id: number): Promise<Post>;
}
