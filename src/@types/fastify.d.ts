import "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		getCurrentUserToken(): Promise<string>;
	}
}
