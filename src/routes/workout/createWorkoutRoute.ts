import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";
import { parseFlexibleDate } from "@/utils/parseFlexibleDate.js";

export async function createWorkoutRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.post(
			"/workout",
			{
				schema: {
					tags: ["Workout"],
					body: z.object({
						name: z.string(),
						notes: z.string().optional(),
						date: z
							.string()
							.transform((value) => {
								const parsed = parseFlexibleDate(value);
								if (!parsed) {
									throw new Error(
										"Formato de data inválido. Use algo como 2025-12-10 ou 10/12/2025.",
									);
								}
								return new Date(parsed);
							})
							.pipe(z.date()),
					}),
				},
			},
			async (request, reply) => {
				const { name, notes, date } = request.body;
				const userId = await request.getCurrentUserToken();

				const workout = await prisma.workout.create({
					data: {
						name,
						notes,
						userId,
						date,
					},
				});

				return reply.status(201).send(workout);
			},
		);
}
