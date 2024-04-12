import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import routes from "./routes/fipeRoutes";

import { getEnvironment, setConfigLogger } from "./constants/environment";

const defaultPort = 3189;
const port = Number(process.env.PORT) || defaultPort;

const server = fastify({
  logger: setConfigLogger(),
});

server.register(routes);
server.register(fastifyCors);

server.setNotFoundHandler(function (request, response) {
  server.log.error(`A rota ${request.url} não existe`);

  response.code(404).send({
    error: 404,
    message: `A rota ${request.url} não existe, tente ${request.hostname}/fipe`,
    query: "carros, motos, caminhoes",
    url: request.url,
  });
});

(async function () {
  try {
    await server.listen({ host: "0.0.0.0", port });

    server.log.info(
      `API start on port ${port} in ${getEnvironment()?.toUpperCase()} environment`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
