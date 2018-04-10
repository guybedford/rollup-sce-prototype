export async function p (r) {
  await Promise.all(r);
  return 5;
}