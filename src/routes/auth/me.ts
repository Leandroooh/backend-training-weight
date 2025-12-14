import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { AuthHandler } from "@/middlewares/AuthHandler.js";
import { prisma } from "@/prisma/client.js";

export async function Me(app: FastifyInstance) {
	app
		.withTypeProvider<ZodTypeProvider>()
		.register(AuthHandler)
		.get(
			"/auth/me",
			{
				schema: {
					tags: ["Auth"],
				},
			},
			async (request, reply) => {
				const token = await request.getCurrentUserToken();

				const user = await prisma.user.findUnique({
					where: { id: token },
					select: {
						id: true,
						email: true,
						username: true,
						createdAt: true,
						updatedAt: true,
					},
				});

				if (!user) {
					return reply
						.status(404)
						.send({ message: "User not found" });
				}

				return reply.status(200).send(user);
			},
		);
}
