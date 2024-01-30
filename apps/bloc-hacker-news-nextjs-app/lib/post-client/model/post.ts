import { string, object, number, picklist, optional, Output } from 'valibot';

export const PostSchema = object({
  by: string(),
  time: number(),
  type: picklist(['comment', 'story']),
  text: optional(string()),
  title: optional(string()),
  url: optional(string()),
});

export type Post = Output<typeof PostSchema>;
