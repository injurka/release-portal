import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { PORT } from './config';
import { apiRouter } from './handlers';

const app = new Elysia()
  .use(cors())
  .use(apiRouter)
  .listen(PORT);

console.log(`🦊 Backend is running at ${app.server?.hostname}:${app.server?.port}`);
