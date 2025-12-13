import { hash } from "bcryptjs";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "@/prisma/client.js";

export async function RegisterUserRoute(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/auth/register",
		{
			schema: {
				tags: ["Auth"],
				body: z.object({
					email: z.string().email("Credenciais inválidas!"),
					username: z.string(),
					password: z.string().min(5),
				}),
			},
		},
		async (request, reply) => {
			const { email, username, password } = request.body;

			const emailAlreadyExist = await prisma.user.findFirst({
				where: {
					email,
				},
			});

			const usernameAlreadyExist = await prisma.user.findFirst({
				where: {
					username,
				},
			});

			if (emailAlreadyExist || usernameAlreadyExist) {
				return reply.status(400).send({
					message: "Credenciais inválidas!",
				});
			}

			const hashPassword = await hash(password, 6);
			const user = await prisma.user.create({
				data: {
					email,
					username,
					password: hashPassword,
				},
			});

			return reply.status(201).send(user);
		},
	);
}
