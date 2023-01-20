import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const channelRouter = createTRPCRouter({
  find: publicProcedure
    .input(z.object({ channel: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.channel.findUnique({
        where: {
          id: input.channel,
        }
      })
    }),
  me: protectedProcedure
    .input(z.object({ channel: z.string() }))
    .query(async ({ ctx }) => {
      return ctx.prisma.channel.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
      });
    }),
  messages: publicProcedure
  .input(z.object({ channel: z.string() }))
  .query(({ input, ctx }) => {
    return ctx.prisma.channelMessage.findMany({
      where: {
        channelId: input.channel,
      }
    })
  }),
});
