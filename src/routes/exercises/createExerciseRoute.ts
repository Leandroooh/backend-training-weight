import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function createExerciseRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.post(
			"/workout/:id/exercises	",
			{
				schema: {
					tags: ["Exercises"],
					body: z.object({
						exercise: z.string(),
					}),
					params: z.object({
						id: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;
				const { exercise } = request.body;
				const userId = await request.getCurrentUserToken();

				const workout = await prisma.workout.findFirst({
					where: {
						id,
						userId,
					},
					select: {
						id: true,
					},
				});

				if (!workout) {
					return reply
						.status(404)
						.send({ message: "Treino não encontrado" });
				}

				const exerciseEntry = await prisma.exerciseEntry.create({
					data: {
						exercise,
						workoutId: workout.id,
					},
				});

				return reply.status(201).send(exerciseEntry);
			},
		);
}
