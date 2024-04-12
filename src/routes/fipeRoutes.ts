import { FastifyInstance, FastifyRegisterOptions } from "fastify";
import {
  getMarcas,
  getVeiculosPorMarca,
  getTabelas,
} from "../controller/fipeController";

export default function (
  fastify: FastifyInstance,
  opts: FastifyRegisterOptions<{}>,
  done: () => void
) {
  //Veiculos
  fastify.route({
    method: "GET",
    url: "/fipe/:tipoVeiculo/marcas",
    handler: getMarcas,
  });

  fastify.route({
    method: "GET",
    url: "/fipe/:tipoVeiculo",
    handler: getVeiculosPorMarca,
  });

  //Tabelas
  fastify.route({
    method: "GET",
    url: "/fipe/tabelas",
    handler: getTabelas,
  });

  done();
}
