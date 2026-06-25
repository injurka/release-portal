import { Elysia } from 'elysia';
import { releasesPlugin } from './releases';

export const apiRouter = new Elysia()
  .use(releasesPlugin);
