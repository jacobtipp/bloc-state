export class Post {
  constructor(
    public by: string,
    public time: number,
    public type: 'comment' | 'story',
    public text?: string,
    public title?: string,
    public url?: string
  ) {}
}
