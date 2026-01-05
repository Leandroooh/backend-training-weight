import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function CreateSeriesRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.post(
			"/exercise/:exerciseEntryId/series",
			{
				schema: {
					tags: ["Series"],
					params: z.object({
						exerciseEntryId: z.string(),
					}),
					body: z.object({
						set: z.number(),
						reps: z.number(),
						seriesWeight: z.number(),
					}),
				},
			},
			async (request, reply) => {
				const { exerciseEntryId } = request.params;
				const { set, reps, seriesWeight } = request.body;

				const seriesAlreadyExists =
					await prisma.exerciseSeries.findFirst({
						where: {
							exerciseEntryId,
							set,
						},
					});

				if (seriesAlreadyExists) {
					return reply
						.status(400)
						.send({ message: `Serie ${set} já cadastrada!` });
				}

				const serie = await prisma.exerciseSeries.create({
					data: {
						set,
						reps,
						seriesWeight,
						exerciseEntryId,
					},
				});

				return reply.status(201).send(serie);
			},
		);
}
