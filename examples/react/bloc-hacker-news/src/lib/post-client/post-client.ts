import { Post } from './model/post';

export abstract class PostClient {
  protected _!: void;
  abstract getPostDetails(id: number, signal?: AbortSignal): Promise<Post>;
}
