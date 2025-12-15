import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function getWorkoutsRoute(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.get(
			"/workouts",
			{
				schema: {
					tags: ["Workout"],
					querystring: z.object({
						page: z.coerce.number().int().min(1).default(1),
						pageSize: z.coerce
							.number()
							.int()
							.min(1)
							.max(100)
							.default(6),
					}),
				},
			},
			async (request, reply) => {
				const { page, pageSize } = request.query;
				const userId = await request.getCurrentUserToken();

				const totalItems = await prisma.workout.count({
					where: { userId },
				});
				const totalPages = Math.ceil(totalItems / pageSize);

				if (totalItems === 0) {
					return reply.status(200).send({
						pagination: {
							page,
							pageSize,
							totalItems: 0,
							totalPages: 0,
						},
						data: [],
					});
				}

				if (page > totalPages) {
					return reply.status(200).send({
						pagination: {
							page,
							pageSize,
							totalItems,
							totalPages,
						},
						data: [],
					});
				}

				const workouts = await prisma.workout.findMany({
					where: { userId },
					skip: (page - 1) * pageSize,
					take: pageSize,
				});
				const formattedWorkouts = workouts.map((workout) => ({
					id: workout.id,
					name: workout.name,
					notes: workout.notes,
					date: workout.date.toISOString().slice(0, 10), // YYYY-MM-DD
					createdAt: workout.createdAt.toISOString(),
					updatedAt: workout.updatedAt.toISOString(),
				}));

				return reply.status(200).send({
					pagination: {
						page,
						pageSize,
						totalItems,
						totalPages,
					},
					data: formattedWorkouts,
				});
			},
		);
}
