import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function deleteExercise(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.delete(
			"/exercises/:id",
			{
				schema: {
					tags: ["Exercises"],
					params: z.object({
						id: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const exercise = await prisma.exerciseEntry.findFirst({
					where: {
						id,
					},
				});
				if (!exercise) {
					return reply
						.status(404)
						.send({ message: "Exercise not found" });
				}
				await prisma.exerciseEntry.delete({
					where: {
						id,
					},
				});
				return reply
					.status(200)
					.send({ message: "Exercise deleted successfully" });
			},
		);
}
