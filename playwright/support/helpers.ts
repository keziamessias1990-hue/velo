export function generateOrderCode() {
  const prefix = 'VLO-';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomPart += characters[randomIndex];
  }

  return prefix + randomPart;
}

// Exemplo de uso
const order = generateOrderCode();
console.log(order);