import { createTRPCRouter } from "./trpc";
import { channelRouter } from "./routers/channel";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  channel: channelRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
