import { compare } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "@/prisma/client.js";

export async function LoginUserRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/login",
		{
			schema: {
				tags: ["Auth"],
				body: z.object({
					email: z.email(),
					password: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const user = await prisma.user.findFirst({ where: { email } });

			if (!user) {
				return reply.status(400).send({ message: "Invalid credentials" });
			}

			const isPasswordCorrect = await compare(password, user.password);

			if (!isPasswordCorrect) {
				return reply.status(400).send({ message: "Invalid credentials" });
			}

			const token = await reply.jwtSign({ sub: user.id }, { expiresIn: "1d" });

			return reply.status(201).send(token);
		},
	);
}
