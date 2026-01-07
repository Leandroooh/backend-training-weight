import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function deleteSeries(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.delete(
			"/series/:id",
			{
				schema: {
					tags: ["Series"],
					params: z.object({
						id: z.string(),
					}),
				},
			},
			async (request, reply) => {
				const { id } = request.params;

				const series = await prisma.exerciseSeries.findFirst({
					where: {
						id,
					},
				});
				if (!series) {
					return reply
						.status(404)
						.send({ message: "Series not found" });
				}
				await prisma.exerciseSeries.delete({
					where: {
						id,
					},
				});
				return reply.status(200).send({ message: "Series deleted" });
			},
		);
}
