import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { fastifySwagger } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";
import { LoginUserRoute } from "./routes/auth/loginRoute.js";
import { Me } from "./routes/auth/me.js";
import { RegisterUserRoute } from "./routes/auth/registerRoute.js";
import { createExerciseRoute } from "./routes/exercise/createExerciseRoute.js";
import { GetExercisesRoute } from "./routes/exercise/getExercisesRoute.js";
import { createWorkoutRoute } from "./routes/workout/createWorkoutRoute.js";
import { getWorkoutById } from "./routes/workout/getWorkoutById.js";
import { getWorkoutsRoute } from "./routes/workout/getWorkoutsRoute.js";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Simple Workout Weight Register API",
			description: "API with Register and Login",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
});

const secret = process.env.JWT_SECRET;
if (!secret) {
	throw new Error("JWT_SECRET is not defined");
}

app.register(fastifyJwt, {
	secret,
});

app.register(fastifyCors, {
	origin: true,
	allowedHeaders: "Content-Type,Authorization",
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
});

app.register(Me);
app.register(LoginUserRoute);
app.register(RegisterUserRoute);

app.register(createWorkoutRoute);
app.register(getWorkoutsRoute);
app.register(getWorkoutById);
app.register(createExerciseRoute);

app.register(GetExercisesRoute);

// app.setErrorHandler((error, request, reply) => {
// 	// 1️⃣ Log detalhado do erro
// 	console.error("💥 Erro capturado no servidor:", {
// 		message: error.message,
// 		stack: error.stack,
// 		name: error.name,
// 		statusCode: (error as any).statusCode, // se existir
// 		validationErrors: (error as any).validation, // se for Zod/Fastify schema
// 	});

// 	// 2️⃣ Retorna uma resposta amigável para o cliente
// 	reply.status(error.statusCode ?? 500).send({
// 		success: false,
// 		message: error.message,
// 		details: (error as any).validation || undefined, // opcional
// 	});
// });

const port = Number(process.env.PORT) || 3000;

app.listen({ port, host: "0.0.0.0" }).then(() => {
	console.log(`API running at http://localhost:${port}`);
	console.log(`Docs running at http://localhost:${port}/docs`);
});
