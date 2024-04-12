export function isNumber(value: string | number) {
  if (Array.isArray(value) || typeof value === "object") {
    return false;
  }

  return typeof value === "number" && isFinite(value);
}
