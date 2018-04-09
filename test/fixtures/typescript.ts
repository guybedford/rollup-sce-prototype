interface result {
  code: string;
};

export function transform (code: string): result {
  return { code: code };
}