import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/prisma/client.js";

export async function GetExercisesRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
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
			// const userId = await request.getCurrentUserToken();

			const exercises = await prisma.exerciseEntry.findMany({
				where: {
					workoutId: id,
				},
			});

			return reply.status(200).send(exercises);
		},
	);
}
