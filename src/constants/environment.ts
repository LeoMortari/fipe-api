const getEnvironment = function () {
  return process.env.NODE_ENV;
};

const setConfigLogger = function () {
  const environment = getEnvironment();

  switch (environment) {
    case "development":
      return {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname,reqId",
          },
        },
      };
    case "homologation":
      return {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "yyyy-mm-dd HH:MM:ss",
            ignore: "pid,hostname",
          },
        },
      };
    case "production":
      return true;
    default:
      return true;
  }
};

export { getEnvironment, setConfigLogger };
