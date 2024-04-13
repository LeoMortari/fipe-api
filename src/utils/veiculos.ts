import { TipoVeiculos } from "../globalTypes/params";
import {
  carros,
  motos,
  caminhoes,
  codigoCarros,
  codigoMotos,
  copdigoCaminhoes,
} from "../constants/tipoVeiculos";
import { tabelas } from "../db/tabelas.json";
import { isNumber } from "./numbers";

export function getCodigoVeiculo(
  tipoVeiculo: string | TipoVeiculos,
  throwable?: boolean
) {
  if (!tipoVeiculo) {
    if (throwable) {
      throw new Error("tipoVeiculo inválido");
    } else {
      return false;
    }
  }

  switch (tipoVeiculo) {
    case carros:
      return codigoCarros;
    case caminhoes:
      return copdigoCaminhoes;
    case motos:
      return codigoMotos;
    default:
      return false;
  }
}

export function getCodigoTabela(tabela: number | undefined | string) {
  if (tabela && isNumber(tabela)) {
    return (
      tabelas.find((referencia) => referencia.codigo === tabela)?.codigo ??
      tabelas.at(0)
    );
  }

  return tabelas.at(0)?.codigo;
}
