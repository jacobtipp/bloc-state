import { State } from '@jacobtipp/state';
import { PostViewModel } from '../models/post-view-model';

export class PostState extends State<PostViewModel> {
  static fromJson(json: string): PostState {
    const parsed = JSON.parse(json) as PostState;
    return new PostState(parsed.data, parsed.status);
  }
}
