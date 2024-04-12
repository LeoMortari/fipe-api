import axios from "axios";

const fipeApi = axios.create({
  baseURL: "https://veiculos.fipe.org.br/",
});

export { fipeApi };
