import { Post } from './model/post';

export interface PostClient {
  getPost(id: number): Promise<Post>;
  cancelPost(id: number): void;
}
