import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/prisma/client.js";
import { parseFlexibleDate } from "@/utils/parseFlexibleDate.js";

export async function UpdateWorkoutRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().patch(
		"/workout/:id",
		{
			schema: {
				params: z.object({
					id: z.string(),
				}),
				body: z
					.object({
						name: z.string().min(1).optional(),
						notes: z.string().optional(),
						date: z
							.string()
							.transform((value) => {
								const parsed = parseFlexibleDate(value);
								if (!parsed) {
									throw new z.ZodError([
										{
											code: "custom",
											message:
												"Formato de data inválido. Use algo como 2025-12-10 ou 10/12/2025.",
											path: ["date"],
										},
									]);
								}
								return new Date(parsed);
							})
							.pipe(z.date())
							.optional(),
					})
					.refine((data) => Object.keys(data).length > 0, {
						message: "Informe ao menos um campo para atualização.",
					}),
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			const userId = await request.getCurrentUserToken();
			const data = request.body;

			const workout = await prisma.workout.findFirst({
				where: {
					id,
					userId,
				},
			});

			if (!workout) {
				return reply.status(404).send({
					message: "Workout not found",
				});
			}

			const updatedWorkout = await prisma.workout.update({
				where: {
					id,
				},
				data,
				select: {
					id: true,
					name: true,
					date: true,
					notes: true,
					updatedAt: true,
				},
			});

			return reply.status(200).send(updatedWorkout);
		},
	);
}
