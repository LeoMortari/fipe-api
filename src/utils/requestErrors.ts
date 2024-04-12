const statusErrors: Record<string, string> = {
  400: "Parametros inválidos",
  401: "Solicitação não autorizada",
  403: "Erro ao processar feriados",
  404: "Erro ao buscar feriados",
  500: "Erro interno, contate um administrador",
};

const getStatusMessage = function (status: string | number) {
  return status ? statusErrors[status] : "";
};

export { statusErrors, getStatusMessage };
