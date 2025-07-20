import { defineCollection, z } from 'astro:content';

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    time: z.string(),
    location: z.string(),
    description: z.string(),
    image: z.string(),
    isUpcoming: z.boolean(),
  }),
});

export const collections = {
  events,
};