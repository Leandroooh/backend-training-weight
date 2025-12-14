import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function getWorkoutById(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.get(
			"/workout/:id",
			{
				schema: {
					tags: ["Workout"],
					params: z.object({
						id: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params as { id: string };
				const userId = await request.getCurrentUserToken();

				const workout = await prisma.workout.findFirst({
					where: {
						id,
						userId,
					},
					select: {
						id: true,
						name: true,
						date: true,
						notes: true,
						createdAt: true,
						updatedAt: true,
						exerciseEntries: {
							select: {
								id: true,
								exercise: true,
								createdAt: true,
								updatedAt: true,
							},
						},
					},
				});

				if (!workout) {
					return reply
						.status(404)
						.send({ message: "Workout not found" });
				}

				return reply.status(200).send({ data: workout });
			},
		);
}
