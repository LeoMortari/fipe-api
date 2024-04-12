import { TipoVeiculos } from "../globalTypes/params";
import {
  carros,
  motos,
  caminhoes,
  codigoCarros,
  codigoMotos,
  copdigoCaminhoes,
} from "../constants/tipoVeiculos";

export function getCodigoVeiculo(
  tipoVeiculo: TipoVeiculos,
  throwable?: boolean
) {
  if (!tipoVeiculo) {
    if (throwable) {
      throw new Error("tipoVeiculo inválido");
    } else {
      return false;
    }
  }
}
