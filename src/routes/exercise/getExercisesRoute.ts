import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function GetExercisesRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.get(
			"/workout/:id/exercises",
			{
				schema: {
					tags: ["Exercise"],
					params: z.object({
						id: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params as { id: string };

				const exercises = await prisma.exerciseEntry.findMany({
					where: {
						workoutId: id,
					},
					select: {
						id: true,
						exercise: true,
						createdAt: true,
						updatedAt: true,
						series: {
							select: {
								series: true,
								reps: true,
								seriesWeight: true,
							},
						},
					},
				});

				return reply.status(200).send(exercises);
			},
		);
}
