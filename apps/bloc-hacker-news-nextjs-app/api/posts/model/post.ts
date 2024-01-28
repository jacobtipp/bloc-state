import {
  string,
  object,
  number,
  picklist,
  optional,
  Output,
  coerce,
} from 'valibot';

export const PostIdSchema = coerce(number(), Number);

export type PostId = Output<typeof PostIdSchema>;

export const PostDetailsSchema = object({
  by: string(),
  time: number(),
  type: picklist(['comment', 'story']),
  text: optional(string()),
  title: optional(string()),
  url: optional(string()),
});

export type PostDetails = Output<typeof PostDetailsSchema>;

export type Post = {
  postId: {
    currentId: PostId;
  };
  details: PostDetails;
};
