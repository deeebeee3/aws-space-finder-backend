export function generateRandomId(): string {
  //return a nice random 10 char string
  return Math.random().toString(36).slice(2);
}
