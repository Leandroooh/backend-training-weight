import type { FastifyInstance, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { Unauthorized } from "./_errors/Unauthorized.js";

export const AuthHandler = fastifyPlugin(async (app: FastifyInstance) => {
	app.addHook("preHandler", async (request: FastifyRequest) => {
		try {
			request.getCurrentUserToken = async () => {
				const { sub } = await request.jwtVerify<{ sub: string }>();
				return sub;
			};
		} catch {
			throw new Unauthorized("Token not found!");
		}
	});
});
