import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function DeleteWorkout(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.delete(
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
				const { id } = request.params;
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
						.send({ message: "Workout not found" });
				}

				await prisma.workout.delete({
					where: {
						id,
						userId,
					},
				});

				return reply
					.status(200)
					.send({ message: "Workout deleted successfully " });
			},
		);
}
