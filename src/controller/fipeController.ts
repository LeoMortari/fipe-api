import { FastifyReply, FastifyRequest } from "fastify";

import {
  carros,
  caminhoes,
  motos,
  codigoCarros,
} from "../constants/tipoVeiculos";

import { isNumber } from "../utils/numbers";
import { TipoVeiculos } from "../globalTypes/params";

//Databases
import carrosDb from "../db/carros.json";
import motosDb from "../db/motos.json";
import caminhoesDb from "../db/caminhoes.json";
import tabelasDb from "../db/tabelas.json";

import { fipeApi } from "../config/axios";

/* 
Função getMarcas () => {value: string | number, label: string}[]

- Busca marcas de acordo com o tipo do veiculo

@param tipoVeiculo = string* 
@type TipoVeiculos = carros | caminhoes | motos
*/

//Todo: Criar um jeito de atualizar as marcas de tempo em tempo
function getMarcas(
  request: FastifyRequest<{ Params: { tipoVeiculo: string } }>,
  reply: FastifyReply
) {
  const { tipoVeiculo } = request.params;

  if (tipoVeiculo === carros) {
    return reply.code(200).send(carrosDb.marcas);
  }

  reply.code(200).send(tipoVeiculo === motos ? motosDb : caminhoesDb);
}

/* 
Função getVeiculosPorMarca () => void

- Busca veiculos de acordo com a marca selecionada via queryParam

@query marca = number*
*/
async function getVeiculosPorMarca(
  request: FastifyRequest<{
    Params: { tipoVeiculo: TipoVeiculos; tabela?: string };
    Querystring: { marca: number };
  }>,
  reply: FastifyReply
) {
  const { marca } = request.query;
  const { tipoVeiculo } = request.params;

  if (!marca || !isNumber(marca)) {
    return reply.code(400).send("O parametro 'marca' deve ser um número");
  }

  try {
    reply.code(202);
  } catch (error: any) {}
}

/* 
Função getTabelas () => void

- Busca tabelas por mes, ou todas as existentes

@query referencia = string*
*/
function getTabelas(
  request: FastifyRequest<{
    Querystring: { mes?: string; ano: string | number };
  }>,
  reply: FastifyReply
) {
  const { ano, mes } = request.query;

  if (ano) {
    if (ano.toString() < "2001") {
      return reply.code(400).send("O ano deve ser maior ou igual a 2001");
    }
  }

  if (ano && !mes) {
    const tabelas = tabelasDb.tabelas.filter((referencia) => {
      const { mes } = referencia;
      const anoReferencia = mes.split("/").at(1)?.trim();

      return ano.toString() === anoReferencia?.toString();
    });

    return reply.code(200).send(tabelas);
  }

  if (mes && !ano) {
    const tabelas = tabelasDb.tabelas.filter((referencia) => {
      const { mes } = referencia;
      const mesReferencia = mes.split("/").at(0)?.trim();

      return mes.toString() === mesReferencia?.toString();
    });

    return reply.code(200).send(tabelas);
  }

  if (mes && ano) {
    const tabelas = tabelasDb.tabelas.filter((referencia) => {
      const { mes: mesReferencia } = referencia;

      return mesReferencia.toString().trim() === `${mes}/${ano}`;
    });

    return reply.code(200).send(tabelas);
  }

  return reply.code(200).send(tabelasDb.tabelas);
}

export { getMarcas, getVeiculosPorMarca, getTabelas };
