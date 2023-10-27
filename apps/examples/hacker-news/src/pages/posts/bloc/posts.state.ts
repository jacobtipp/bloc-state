import { State } from '@jacobtipp/state';
import { PostViewModel } from '../models/post-view-model';

export class PostState extends State<PostViewModel> {
  constructor() {
    super({
      transformer: 'concurrent',
      details: {
        by: '',
        time: 0,
        type: 'comment',
      },
    });
  }
}
