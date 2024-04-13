import { FastifyReply, FastifyRequest } from "fastify";

import { carros, motos } from "../constants/tipoVeiculos";

import { TipoVeiculos } from "../globalTypes/params";

//Databases
import carrosDb from "../db/carros.json";
import motosDb from "../db/motos.json";
import caminhoesDb from "../db/caminhoes.json";
import tabelasDb from "../db/tabelas.json";

import { fipeApi } from "../config/axios";
import { getCodigoTabela, getCodigoVeiculo } from "../utils/veiculos";
import { statusErrors } from "../utils/requestErrors";
import { responseFormat } from "../utils/response";

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
    return reply.code(statusErrors.SUCESS.OK).send(carrosDb.marcas);
  }

  reply
    .code(statusErrors.SUCESS.OK)
    .send(
      responseFormat({ content: tipoVeiculo === motos ? motosDb : caminhoesDb })
    );
}

/* 
Função getVeiculosPorMarca () => void

- Busca veiculos de acordo com a marca selecionada via queryParam

@query marca = number*
*/
async function getVeiculosPorMarca(
  request: FastifyRequest<{
    Params: { tipoVeiculo: TipoVeiculos };
    Querystring: { marca: number; tabela?: number };
  }>,
  reply: FastifyReply
) {
  const { marca, tabela } = request.query;
  const { tipoVeiculo } = request.params;

  if (!marca) {
    return reply
      .code(statusErrors.ERRORS.BAD_REQUEST)
      .send("O parametro 'marca' deve ser um número");
  }

  try {
    const codigoTabela = getCodigoTabela(tabela);
    const codigoTipoVeiculo = getCodigoVeiculo(tipoVeiculo);

    if (!codigoTipoVeiculo) {
      return reply
        .code(statusErrors.ERRORS.BAD_REQUEST)
        .send("O tipo do veiculo não foi informado");
    }

    const { data } = await fipeApi.post("/api/veiculos//ConsultarModelos", {
      codigoTipoVeiculo,
      codigoTabelaReferencia: codigoTabela,
      codigoMarca: marca,
    });

    const result = {
      modelos: data.Modelos?.map((item: { Label: string; Value: string }) => ({
        label: item.Label,
        value: item.Value,
      })),
      anos: data.Anos?.map((item: { Label: string; Value: string }) => ({
        label: item.Label,
        value: item.Value,
      })),
    };

    reply
      .code(statusErrors.SUCESS.OK)
      .send(responseFormat({ content: result }));
  } catch (error: any) {
    if (error.response) {
      // Se tiver response, é um erro do Axios
      reply
        .code(statusErrors.ERRORS.INTERNAL_SERVER_ERROR)
        .send(responseFormat({ content: [] }));
    }
  }
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
      return reply.code(statusErrors.ERRORS.BAD_REQUEST).send(
        responseFormat({
          content: [],
          error: true,
          errorMessage: "O ano deve ser maior ou igual a 2001",
        })
      );
    }
  }

  if (ano && !mes) {
    const tabelas = tabelasDb.tabelas.filter((referencia) => {
      const { mes } = referencia;
      const anoReferencia = mes.split("/").at(1)?.trim();

      return ano.toString() === anoReferencia?.toString();
    });

    return reply
      .code(statusErrors.SUCESS.OK)
      .send(responseFormat({ content: tabelas }));
  }

  if (mes && !ano) {
    const tabelas = tabelasDb.tabelas.filter((referencia) => {
      const { mes: mesRef } = referencia;
      const mesReferencia = mesRef.split("/").at(0)?.trim();

      return mes.toString() === mesReferencia?.toString();
    });

    return reply
      .code(statusErrors.SUCESS.OK)
      .send(responseFormat({ content: tabelas }));
  }

  if (mes && ano) {
    const tabelas = tabelasDb.tabelas.filter((referencia) => {
      const { mes: mesReferencia } = referencia;

      return mesReferencia.toString().trim() === `${mes}/${ano}`;
    });

    return reply
      .code(statusErrors.SUCESS.OK)
      .send(responseFormat({ content: tabelas }));
  }

  return reply
    .code(statusErrors.SUCESS.OK)
    .send(responseFormat({ content: tabelasDb.tabelas }));
}

export { getMarcas, getVeiculosPorMarca, getTabelas };
