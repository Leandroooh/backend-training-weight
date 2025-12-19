import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";
import { parseFlexibleDateRange } from "@/utils/parseFlexibleDateRange.js";

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
						from: z.string().optional(),
						to: z.string().optional(),
					}),
				},
			},
			async (request, reply) => {
				const { page, pageSize, from, to } = request.query;
				const userId = await request.getCurrentUserToken();

				let dateFilter:
					| {
							gte?: Date;
							lte?: Date;
					  }
					| undefined;

				if (from || to) {
					dateFilter = {};

					if (from) {
						const range = parseFlexibleDateRange(from);
						if (!range) {
							return reply
								.status(400)
								.send({ message: "Data inicial inválida" });
						}
						dateFilter.gte = range.start;
					}

					if (to) {
						const range = parseFlexibleDateRange(to);
						if (!range) {
							return reply
								.status(400)
								.send({ message: "Data final inválida" });
						}
						dateFilter.lte = range.end;
					}

					if (
						dateFilter.gte &&
						dateFilter.lte &&
						dateFilter.gte > dateFilter.lte
					) {
						return reply
							.status(400)
							.send({ message: "Período de datas inválido" });
					}
				}

				const where = {
					userId,
					...(dateFilter && { date: dateFilter }),
				};

				const totalItems = await prisma.workout.count({ where });
				const totalPages = Math.ceil(totalItems / pageSize);

				if (totalItems === 0 || page > totalPages) {
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
					where,
					skip: (page - 1) * pageSize,
					take: pageSize,
					orderBy: { date: "desc" },
				});

				return reply.status(200).send({
					pagination: {
						page,
						pageSize,
						totalItems,
						totalPages,
					},
					data: workouts,
				});
			},
		);
}
