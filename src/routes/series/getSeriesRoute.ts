import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function GetSeriesRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.get(
			"/exercise/:exerciseEntryId/series",
			{
				schema: {
					tags: ["Series"],
					params: z.object({
						exerciseEntryId: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { exerciseEntryId } = request.params;
				const series = await prisma.exerciseSeries.findMany({
					where: {
						exerciseEntryId,
					},
					select: {
						id: true,
						reps: true,
						series: true,
						seriesWeight: true,
					},
				});
				return reply.status(200).send(series);
			},
		);
}
