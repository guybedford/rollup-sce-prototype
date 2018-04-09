export async function x (r) { 
  await Promise.all(r);
  return 5;
}