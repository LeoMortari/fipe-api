export function responseFormat({
  content,
  error,
  errorMessage,
}: {
  content: any | any[];
  error?: boolean;
  errorMessage?: string;
}) {
  const defaultErrorMessage =
    "Desculpe, no momento nossos servidores estão enfrentando problemas, voltaremos o mais rápido possível";

  if (error) {
    return {
      content,
      error: true,
      errorMessage: errorMessage || defaultErrorMessage,
    };
  }

  return { content };
}
